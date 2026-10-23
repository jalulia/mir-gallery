// Password is supplied on stdin; never commit it or put it in command arguments.
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve,relative,dirname,posix} from 'node:path';
import {pbkdf2Sync,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
const [mode,input,output]=process.argv.slice(2);
if(!['encrypt','decrypt'].includes(mode)||!input||!output)throw Error('Usage: node tools/protect.mjs encrypt|decrypt INPUT_DIR OUTPUT_DIR (password on stdin)');
let password='';for await(const chunk of process.stdin)password+=chunk;password=password.replace(/\r?\n$/,'');if(!password)throw Error('Password required');
const salt=Buffer.from('mir-gallery-shared-library-2026-v1'),iterations=600000,key=pbkdf2Sync(password,salt,iterations,32,'sha256');password='';
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name==='.git')continue;const p=resolve(dir,entry.name);if(entry.isDirectory())files.push(...await walk(p));else if(p.endsWith('.html'))files.push(p)}return files}
const template=await readFile(new URL('./access-template.txt',import.meta.url),'utf8');
let count=0;
for(const file of await walk(resolve(input))){let html=await readFile(file,'utf8');const path=relative(resolve(input),file),dest=resolve(output,path);await mkdir(dirname(dest),{recursive:true});
 if(mode==='decrypt'){
  const match=html.match(/<script type="application\/json" id="protected-content">([\s\S]*?)<\/script>/);if(!match)continue;const p=JSON.parse(match[1]),data=Buffer.from(p.ciphertext,'base64'),decrypt=createDecipheriv('aes-256-gcm',key,Buffer.from(p.iv,'base64'));decrypt.setAuthTag(data.subarray(-16));html=Buffer.concat([decrypt.update(data.subarray(0,-16)),decrypt.final()]).toString();
 }else{
  const root=posix.relative(posix.dirname(path.replaceAll('\\','/')),'.')||'.';
  if(path==='index.html'&&!html.includes('collaboration/feedback.js')){html=html.replace('</head>',`<link rel="stylesheet" href="${root}/collaboration/feedback.css?v=2"></head>`);const end=html.lastIndexOf('</body>');html=html.slice(0,end)+`<script src="${root}/collaboration/config.js?v=2"></script><script src="${root}/collaboration/feedback.js?v=2"></script>`+html.slice(end);}
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv),encrypted=Buffer.concat([cipher.update(html),cipher.final(),cipher.getAuthTag()]);
  const payload=JSON.stringify({version:1,salt:salt.toString('base64'),iterations,iv:iv.toString('base64'),ciphertext:encrypted.toString('base64')});
  html=template.replaceAll('{{ROOT}}',root).replace('{{PAYLOAD}}',payload);
 }
 await writeFile(dest,html);count++;
}
console.log(`${mode==='encrypt'?'Protected':'Opened'} ${count} HTML pages.`);
