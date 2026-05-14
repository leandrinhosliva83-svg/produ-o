import { createSign } from 'crypto';

const UPSTASH_URL = 'https://splendid-ray-99496.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

const PK = ['-----BEGIN PRIVATE KEY-----','MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNHGESlKANspub','M9h75B7rjJCASzyVCIsHdiBlNjkK56bLXUUKjHab18hQ56dxzgX4TSTAayESIjGX','4Q1GjExTWPyKS6Gg3+x6QkRsrvP7/4RtM4ssSg1rZeOIj/dmuFuC0CmU+If3+GhR','bMK+a+um65p+6/XULbDfFTaFQfkigdGuAvL11Yy6XXOq11xHXcpxgTk8nCEYAgLQ','sy23FKlrMftjA/blFS/wTe0/s/svag9J0FeKfU8Sy0YqaMQqSSX0hUONdpSiHVDx','AGWGdh6AhUeuYns2gV0Rp89wkF7tTOQyyQQDoESGFzsuC5eTr3R1VNmQLll0IlY+','LiyW/DAlAgMBAAECggEAKRVhID6i3HuFDY5R82bbBqVOIFRxmwxuBJ2VmZBF1rhV','wXA6LwW5kDeliQcNlA8HRRf2n5AVvLMaqehLJ3FcrGkrlGvXwQh5LnftirN0bWpd','1R2457MhgvySmbz0eh+9PLODULKDUZjxFDYrv8aQGgwhEwEiaVCJl/WAySpQw6dP','AN/Ry+tYDwY7ChVjRtxXgI1hIYoJAOAzr3b4MWfaCXpasXAlMrsJh96AZbqeEt44','Iyynwd6d6xgnQn8lkG+Pqgc+M+75vmFWhSt4AAInzl8AfsvA0rna4qxZYGW92nig','epeVfckWY2Q13cOI4JtG8YjI5a6apPwqt45qC/u1NQKBgQD5LFMYaAsMXW+/uQjm','DZ2573yyuYbY4nkfdzLJx/umj7iuOGN0i6xQOnjnUiHfT2TWDIwpMeFuEmozW8Ch','y/9hs0inZold7rlOoByhJFVHRKuZa6fvD637rgCixurpLqt8iMcwQ523770+3cVN','Ll1Mm8zXto3j348Af94JkSZr0wKBgQDSuwGSmOx+U9/CBMr7xN0sb78u6V3lai+A','HIuwRrLpIMaLcJVDhFQZb/ngV/PlC8vUaEqUNpcp4qM3dTuvAP04W2P1x2JFDBBP','LqAStnN0NoK0kE1OTVkXn4nXwb+MZs33rjfibXyRiAuGXgP41ie/f9QOSHwVA/ky','1zHbt2xRJwKBgQCxwYYyFh8zngCXlIgdnj8UIx4hXist1Dq2UNHBk1IaW9NTLlT9','EptFzMDtvPD/HuN/tAnVZYk9fhOXOfBtPFuetkixa3u5sBEwXxaten7/zaRhWaS+','7b+fmV1IwoFZAntB5026R7JfQr8N9yXGzrmuakMy7D/C/XxFzfJ3fr4bEwKBgFvT','nZXSCYvq5KBZElKvsGlCsJ6ylnX31YcP6VcBF8k6vQnaH1DygusqvkoiSWdPwpxm','bck0GJ7p4ZGzBjT2S2GZgW+CWLIZ1amLebltw9WqQz6HewhZ8C65GInqJZv62FnL','kxKZ/yQzkkIVCcoPF/b8rt0ifN9zgc3DtDg4L30VAoGBALl7vAQfEeOOkQe/ciJa','qxrGB8DV6l/cNoZLh/w/A0o3kl7EcLZ8j+RHZLKF3PoSYUeWDAcjea8TGHsIyQ6c','4PySBSkAGMlo9Od4IWBEIBhBDCuePaKmehDvYtTLjzWzYKWDVcjDafnIIk5gqrZV','3kz9S62OYbZrgWvm7nxlt5U6','-----END PRIVATE KEY-----'].join('\n');
const CE = 'firebase-adminsdk-fbsvc@frota-moreno.iam.gserviceaccount.com';
const TU = 'https://oauth2.googleapis.com/token';
const PROJ = 'frota-moreno';

function b64u(s){return Buffer.from(s).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}

async function getFBToken(){
  const now=Math.floor(Date.now()/1000);
  const h=b64u(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const p=b64u(JSON.stringify({iss:CE,sub:CE,aud:TU,iat:now,exp:now+3600,scope:'https://www.googleapis.com/auth/firebase.messaging'}));
  const s=createSign('RSA-SHA256');
  s.update(h+'.'+p);
  const sig=s.sign(PK,'base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(TU,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+h+'.'+p+'.'+sig});
  return(await r.json()).access_token;
}

async function kget(k){
  try{const r=await fetch('https://splendid-ray-99496.upstash.io/get/'+encodeURIComponent(k),{headers:{Authorization:'Bearer gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw'}});const j=await r.json();return j.result?JSON.parse(j.result):null;}catch(e){return null;}
}

async function kset(k,v){
  try{await fetch('https://splendid-ray-99496.upstash.io/set/'+encodeURIComponent(k),{method:'POST',headers:{Authorization:'Bearer gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw','Content-Type':'application/json'},body:JSON.stringify(JSON.stringify(v))});}catch(e){}
}

function proj(realizado){
  const ag=new Date();
  let minD=(ag.getHours()*60+ag.getMinutes())-360;
  if(minD<0)minD+=1440;
  const minR=1440-minD;
  if(minD<=0||realizado<=0)return null;
  return{projecao:realizado+(realizado/minD)*minR};
}

async function push(token,title,body,at){
  try{
    const r=await fetch('https://fcm.googleapis.com/v1/projects/'+PROJ+'/messages:send',{method:'POST',headers:{Authorization:'Bearer '+at,'Content-Type':'application/json'},body:JSON.stringify({message:{token,notification:{title,body},android:{priority:'high'},webpush:{headers:{Urgency:'high'},notification:{requireInteraction:true,vibrate:[300,100,300]}}}})});
    return r.ok;
  }catch(e){return false;}
}

export default async function handler(req,res){
  const intervalo=await kget('notif_intervalo')||5;
  const ultimo=await kget('ultimo_push')||0;
  const diffMin=(Date.now()-ultimo)/60000;
  if(diffMin<intervalo)return res.json({ok:true,msg:'Aguardando '+Math.ceil(intervalo-diffMin)+' min'});

  const metas=await kget('metas')||{};
  const alertas=[];

  for(const emp of['CEM','CEMMA','COPLASA']){
    const d=await kget(emp+'_dia');
    if(!d||!d.data||!d.data.length)continue;
    const g={};
    for(const row of d.data){const k=row.ownerCode||'';if(!g[k])g[k]={owner:row.owner,code:k,total:0};g[k].total+=parseFloat(row.e||row.ton||0)||0;}
    for(const[code,o]of Object.entries(g)){
      const meta=metas[code]||metas[String(parseInt(code))];
      if(!meta||o.total<=0)continue;
      const p=proj(o.total);
      if(!p)continue;
      if(p.projecao<meta)alertas.push(emp+' - '+o.owner+' - '+((p.projecao/meta)*100).toFixed(0)+'% (proj:'+Math.round(p.projecao)+'t/meta:'+meta+'t)');
    }
  }

  for(const emp of['CEM','CEMMA','COPLASA']){
    const d=await kget('entrega_'+emp);
    if(!d||!d.data||!d.data.length)continue;
    for(const r of d.data){
      const meta=metas['f_'+r.codigo]||metas['f_'+parseInt(r.codigo)];
      if(!meta||!r.entrega)continue;
      const p=proj(r.entrega);
      if(!p)continue;
      if(p.projecao<meta)alertas.push(emp+' - Frente '+r.codigo+' - '+((p.projecao/meta)*100).toFixed(0)+'%');
    }
  }

  if(!alertas.length)return res.json({ok:true,msg:'Todas as metas no prazo'});

  const tokens=[];
  try{const r=await fetch('https://splendid-ray-99496.upstash.io/keys/fcm_token_*',{headers:{Authorization:'Bearer gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw'}});const j=await r.json();if(j.result&&j.result.length)for(const k of j.result){const t=await kget(k);if(t)tokens.push(t);}}catch(e){}

  if(!tokens.length)return res.json({ok:true,alertas:alertas.length,msg:'Sem tokens'});

  const at=await getFBToken();
  const title='Alerta de Meta Grupo Moreno';
  const body=alertas.slice(0,4).join(' | ');
  let ok=0;
  for(const token of tokens){if(await push(token,title,body,at))ok++;}
  if(ok>0)await kset('ultimo_push',Date.now());
  return res.json({ok:true,alertas:alertas.length,enviados:ok});
}
