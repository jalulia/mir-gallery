// verify_jwt=false: this handler authenticates the shared library key itself.
// Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-side.
const ORIGIN='https://jalulia.github.io',MAX_FILE=5*1024*1024,MAX_BODY=7*1024*1024+64000;
const cors={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async(request:Request)=>{
 if(request.headers.get('origin')!==ORIGIN)return reply(403,{error:'Origin not allowed'});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return reply(405,{error:'Method not allowed'});
 const verifier=Deno.env.get('COLLABORATION_ACCESS_KEY_SHA256')||'6049f74b4a8e96aca7dd49fce6ce7745a3ee800b926073bd8722982234820bdf';
 if(!/^[a-f0-9]{64}$/.test(verifier))return reply(503,{error:'Inbox is not configured'});
 const supplied=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(request.headers.get('authorization')||'')));
 const expected=Uint8Array.from(verifier.match(/../g)!,n=>parseInt(n,16));let mismatch=0;for(let i=0;i<32;i++)mismatch|=supplied[i]^expected[i];
 if(mismatch)return reply(401,{error:'Unlock the library before submitting'});
 let uploadedPath:string|null=null,newUpload=false;
 const base=Deno.env.get('SUPABASE_URL'),serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!base||!serviceKey)return reply(503,{error:'Inbox is not configured'});
 const auth={apikey:serviceKey,Authorization:'Bearer '+serviceKey};
 try{
  if(Number(request.headers.get('content-length')||0)>MAX_BODY)return reply(413,{error:'Submission is too large'});
  const reader=request.body?.getReader();if(!reader)return reply(400,{error:'Missing submission'});
  let length=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>MAX_BODY){await reader.cancel();return reply(413,{error:'Submission is too large'})}chunks.push(value)}
  const raw=new Uint8Array(length);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length}const body=JSON.parse(new TextDecoder().decode(raw));
  const text=(name:string,max:number)=>typeof body[name]==='string'&&body[name].length<=max;
  if(!text('id',36)||! /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(body.id)||!text('author',100)||!text('title',160)||!body.title.trim()||!text('note',16000)||!text('page',100)||!text('page_title',200)||!text('base_revision',40)||!text('page_url',600))return reply(400,{error:'Check the submission fields'});
  const url=new URL(body.page_url);if(url.origin!==ORIGIN||!url.pathname.startsWith('/mir-gallery/'))return reply(400,{error:'Invalid page URL'});
  let attachment:Uint8Array|null=null,name:string|null=null,mime:string|null=null;
  if(body.upload){const u=body.upload;if(typeof u.name!=='string'||!u.name||u.name.length>255||typeof u.type!=='string'||u.type.length>100||typeof u.base64!=='string'||u.base64.length>6990508||!Number.isInteger(u.bytes)||u.bytes<0||u.bytes>MAX_FILE)return reply(400,{error:'Invalid file'});const binary=atob(u.base64);if(binary.length!==u.bytes)return reply(400,{error:'Invalid file size'});attachment=Uint8Array.from(binary,c=>c.charCodeAt(0));name=u.name;mime=u.type;uploadedPath=body.id+'/'+u.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,120)}
  if(!body.note.trim()&&!attachment)return reply(400,{error:'Add text or a file'});
  if(attachment&&uploadedPath){const safeType=['image/png','image/jpeg','image/webp','application/pdf','text/plain'].includes(mime!)?mime!:'application/octet-stream';const uploaded=await fetch(base+'/storage/v1/object/gallery-review/'+uploadedPath,{method:'POST',headers:{...auth,'Content-Type':safeType,'x-upsert':'false'},body:attachment});if(uploaded.ok)newUpload=true;else{let result;try{result=await uploaded.json()}catch{}if(uploaded.status!==409&&result?.statusCode!=='409')return reply(503,{error:'Could not store file'})}}
  const row={id:body.id,author:body.author,title:body.title,note:body.note,page:body.page,page_title:body.page_title,page_url:body.page_url,base_revision:body.base_revision,file_path:uploadedPath,file_name:name,file_mime:mime,file_bytes:attachment?.length??null,status:'new'};
  const saved=await fetch(base+'/rest/v1/gallery_proposals?on_conflict=id',{method:'POST',headers:{...auth,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(row)});
  if(!saved.ok){if(newUpload&&uploadedPath)await fetch(base+'/storage/v1/object/gallery-review',{method:'DELETE',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({prefixes:[uploadedPath]})});return reply(503,{error:'Could not save submission'})}
  return reply(201,{id:body.id,status:'new'});
 }catch{return reply(400,{error:'Invalid submission'})}
});
