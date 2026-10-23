// Deploy with verify_jwt=false. Authorization is the shared library key below.
// Required secrets: COLLABORATION_ACCESS_KEY_SHA256 (optional override), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
const origin='https://jalulia.github.io';
const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
Deno.serve(async(request:Request)=>{
 if(request.headers.get('origin')!==origin)return reply(403,{error:'Origin not allowed'});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return reply(405,{error:'Method not allowed'});
 // This is a verifier, not the bearer credential.
 const expected=Deno.env.get('COLLABORATION_ACCESS_KEY_SHA256')||'6049f74b4a8e96aca7dd49fce6ce7745a3ee800b926073bd8722982234820bdf';
 if(!expected)return reply(503,{error:'Inbox is not configured'});
 const supplied=request.headers.get('authorization')||'';
 const a=await digest(supplied),b=Uint8Array.from(expected.match(/../g)!,part=>parseInt(part,16));
 let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];
 if(mismatch)return reply(401,{error:'Unlock the library before submitting'});
 try{
  if(Number(request.headers.get('content-length')||0)>40000)return reply(413,{error:'Proposal is too large'});
  const reader=request.body?.getReader();if(!reader)return reply(400,{error:'Missing proposal'});
  let total=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>40000){await reader.cancel();return reply(413,{error:'Proposal is too large'})}chunks.push(value)}
  const raw=new Uint8Array(total);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length}const body=JSON.parse(new TextDecoder().decode(raw));
  const text=(name:string,max:number)=>typeof body[name]==='string'&&body[name].length<=max;
  if(!text('id',36)||!/^[-a-f0-9]{36}$/.test(body.id)||!['feedback','proposal','mir-proposal'].includes(body.kind)||!text('author',100)||!text('note',12000)||!body.note.trim()||!text('replacement',16000)||!text('page',100)||!text('page_title',200)||!text('base_revision',40)||!text('page_url',600))return reply(400,{error:'Check the proposal fields'});
  const url=new URL(body.page_url);if(url.origin!==origin||!url.pathname.startsWith('/mir-gallery/'))return reply(400,{error:'Invalid page URL'});
  const row={id:body.id,kind:body.kind,author:body.author,note:body.note,replacement:body.replacement,page:body.page,page_title:body.page_title,page_url:body.page_url,base_revision:body.base_revision,status:'new'};
  const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const response=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/gallery_proposals',{method:'POST',headers:{apikey:serviceKey,Authorization:'Bearer '+serviceKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row)});
  if(!response.ok)return reply(503,{error:'Could not save proposal'});
  return reply(201,{id:row.id,status:'new'});
 }catch{return reply(400,{error:'Invalid proposal'})}
});
