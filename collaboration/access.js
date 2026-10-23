(()=>{'use strict';
const payload=JSON.parse(document.getElementById('protected-content').textContent),form=document.querySelector('form'),input=document.getElementById('password'),message=document.getElementById('message'),button=form.querySelector('.enter');
const STORE='mir-gallery:access:v1',enc=new TextEncoder(),decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),encode=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
window.MirAccess={lock(){try{sessionStorage.removeItem(STORE)}catch{}location.reload()}};
async function open(raw){const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(payload.iv)},key,decode(payload.ciphertext)))}
function show(html){document.open();document.write(html);document.close()}
async function restore(){let saved;try{saved=sessionStorage.getItem(STORE)}catch{}if(!saved)return;try{show(await open(decode(saved)))}catch{try{sessionStorage.removeItem(STORE)}catch{}}}
form.addEventListener('submit',async e=>{e.preventDefault();message.textContent='';button.disabled=true;button.querySelector('span').textContent='Opening…';let html,raw;
 try{if(!crypto.subtle)throw new Error('unsupported');const material=await crypto.subtle.importKey('raw',enc.encode(input.value),'PBKDF2',false,['deriveBits']);raw=await crypto.subtle.deriveBits({name:'PBKDF2',salt:decode(payload.salt),iterations:payload.iterations,hash:'SHA-256'},material,256);html=await open(raw)}catch(error){message.textContent=error.message==='unsupported'?'Please use a current browser over HTTPS to enter.':'That password didn’t open the library. Try again.';input.setAttribute('aria-invalid','true');input.focus();input.select();button.disabled=false;button.querySelector('span').textContent='Enter library';return}
 input.value='';try{sessionStorage.setItem(STORE,encode(raw))}catch{}show(html)});
document.querySelector('.reveal').addEventListener('click',e=>{const shown=input.type==='password';input.type=shown?'text':'password';e.currentTarget.textContent=shown?'Hide':'Show';e.currentTarget.setAttribute('aria-pressed',String(shown))});input.addEventListener('input',()=>input.removeAttribute('aria-invalid'));if(document.readyState==='complete')restore();else addEventListener('load',restore,{once:true});
})();
