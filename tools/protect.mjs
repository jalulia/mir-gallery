// Password is supplied on stdin; never commit it or put it in command arguments.
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve,relative,dirname,posix} from 'node:path';
import {pbkdf2Sync,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
const [mode,input,output]=process.argv.slice(2);
if(!['encrypt','decrypt'].includes(mode)||!input||!output)throw Error('Usage: node tools/protect.mjs encrypt|decrypt INPUT_DIR OUTPUT_DIR (password on stdin)');
let password='';for await(const chunk of process.stdin)password+=chunk;password=password.replace(/\r?\n$/,'');if(!password)throw Error('Password required');
const salt=Buffer.from('mir-gallery-shared-library-2026-v1'),iterations=600000,key=pbkdf2Sync(password,salt,iterations,32,'sha256');password='';
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name==='.git')continue;const p=resolve(dir,entry.name);if(entry.isDirectory())files.push(...await walk(p));else if(p.endsWith('.html'))files.push(p)}return files}
let count=0;
for(const file of await walk(resolve(input))){let html=await readFile(file,'utf8');const path=relative(resolve(input),file),dest=resolve(output,path);await mkdir(dirname(dest),{recursive:true});
 if(mode==='decrypt'){
  const match=html.match(/<script type="application\/json" id="protected-content">([\s\S]*?)<\/script>/);if(!match)continue;const p=JSON.parse(match[1]),data=Buffer.from(p.ciphertext,'base64'),decrypt=createDecipheriv('aes-256-gcm',key,Buffer.from(p.iv,'base64'));decrypt.setAuthTag(data.subarray(-16));html=Buffer.concat([decrypt.update(data.subarray(0,-16)),decrypt.final()]).toString();
 }else{
  const root=posix.relative(posix.dirname(path.replaceAll('\\','/')),'.')||'.';
  if(path==='index.html'&&!html.includes('collaboration/feedback.js')){html=html.replace('</head>',`<link rel="stylesheet" href="${root}/collaboration/feedback.css"></head>`);const end=html.lastIndexOf('</body>');html=html.slice(0,end)+`<script src="${root}/collaboration/config.js"></script><script src="${root}/collaboration/feedback.js"></script>`+html.slice(end);}
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv),encrypted=Buffer.concat([cipher.update(html),cipher.final(),cipher.getAuthTag()]);
  const payload=JSON.stringify({version:1,salt:salt.toString('base64'),iterations,iv:iv.toString('base64'),ciphertext:encrypted.toString('base64')});
  html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Mindgut — Private library</title><link rel="stylesheet" href="${root}/collaboration/access.css"></head><body><header><span class="wordmark">mindgut</span><span>Private library</span></header><main><div class="motif" aria-hidden="true"></div><div class="eyebrow">A space to think together</div><h1>Welcome in.</h1><p class="intro">Enter the shared password to explore the library and help it evolve.</p><form><label for="password">Password</label><div class="entry"><input id="password" type="password" autocomplete="current-password" required autofocus aria-describedby="message"><button type="button" class="reveal" aria-pressed="false">Show</button></div><button class="enter" type="submit"><span>Enter</span><span aria-hidden="true">↗</span></button><p id="message" role="status" aria-live="polite"></p></form><noscript>Enable JavaScript to unlock this encrypted page.</noscript></main><footer><span>Mindgut · Working library</span><span>For the people building this together.</span></footer><script type="application/json" id="protected-content">${payload}</script><script src="${root}/collaboration/access.js"></script></body></html>`;
 }
 await writeFile(dest,html);count++;
}
console.log(`${mode==='encrypt'?'Protected':'Opened'} ${count} HTML pages.`);
