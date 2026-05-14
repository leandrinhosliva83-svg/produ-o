import { createSign } from 'crypto';

const UPSTASH_URL = 'https://splendid-ray-99496.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

const PRIVATE_KEY = ['-----BEGIN PRIVATE KEY-----','MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNHGESlKANspub','M9h75B7rjJCASzyVCIsHdiBlNjkK56bLXUUKjHab18hQ56dxzgX4TSTAayESIjGX','4Q1GjExTWPyKS6Gg3+x6QkRsrvP7/4RtM4ssSg1rZeOIj/dmuFuC0CmU+If3+GhR','bMK+a+um65p+6/XULbDfFTaFQfkigdGuAvL11Yy6XXOq11xHXcpxgTk8nCEYAgLQ','sy23FKlrMftjA/blFS/wTe0/s/svag9J0FeKfU8Sy0YqaMQqSSX0hUONdpSiHVDx','AGWGdh6AhUeuYns2gV0Rp89wkF7tTOQyyQQDoESGFzsuC5eTr3R1VNmQLll0IlY+','LiyW/DAlAgMBAAECggEAKRVhID6i3HuFDY5R82bbBqVOIFRxmwxuBJ2VmZBF1rhV','wXA6LwW5kDeliQcNlA8HRRf2n5AVvLMaqehLJ3FcrGkrlGvXwQh5LnftirN0bWpd','1R2457MhgvySmbz0eh+9PLODULKDUZjxFDYrv8aQGgwhEwEiaVCJl/WAySpQw6dP','AN/Ry+tYDwY7ChVjRtxXgI1hIYoJAOAzr3b4MWfaCXpasXAlMrsJh96AZbqeEt44','Iyynwd6d6xgnQn8lkG+Pqgc+M+75vmFWhSt4AAInzl8AfsvA0rna4qxZYGW92nig','epeVfckWY2Q13cOI4JtG8YjI5a6apPwqt45qC/u1NQKBgQD5LFMYaAsMXW+/uQjm','DZ2573yyuYbY4nkfdzLJx/umj7iuOGN0i6xQOnjnUiHfT2TWDIwpMeFuEmozW8Ch','y/9hs0inZold7rlOoByhJFVHRKuZa6fvD637rgCixurpLqt8iMcwQ523770+3cVN','Ll1Mm8zXto3j348Af94JkSZr0wKBgQDSuwGSmOx+U9/CBMr7xN0sb78u6V3lai+A','HIuwRrLpIMaLcJVDhFQZb/ngV/PlC8vUaEqUNpcp4qM3dTuvAP04W2P1x2JFDBBP','LqAStnN0NoK0kE1OTVkXn4nXwb+MZs33rjfibXyRiAuGXgP41ie/f9QOSHwVA/ky','1zHbt2xRJwKBgQCxwYYyFh8zngCXlIgdnj8UIx4hXist1Dq2UNHBk1IaW9NTLlT9','EptFzMDtvPD/HuN/tAnVZYk9fhOXOfBtPFuetkixa3u5sBEwXxaten7/zaRhWaS+','7b+fmV1IwoFZAntB5026R7JfQr8N9yXGzrmuakMy7D/C/XxFzfJ3fr4bEwKBgFvT','nZXSCYvq5KBZElKvsGlCsJ6ylnX31YcP6VcBF8k6vQnaH1DygusqvkoiSWdPwpxm','bck0GJ7p4ZGzBjT2S2GZgW+CWLIZ1amLebltw9WqQz6HewhZ8C65GInqJZv62FnL','kxKZ/yQzkkIVCcoPF/b8rt0ifN9zgc3DtDg4L30VAoGBALl7vAQfEeOOkQe/ciJa','qxrGB8DV6l/cNoZLh/w/A0o3kl7EcLZ8j+RHZLKF3PoSYUeWDAcjea8TGHsIyQ6c','4PySBSkAGMlo9Od4IWBEIBhBDCuePaKmehDvYtTLjzWzYKWDVcjDafnIIk5gqrZV','3kz9S62OYbZrgWvm7nxlt5U6','-----END PRIVATE KEY-----'].join('\n');

const CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@frota-moreno.iam.gserviceaccount.com';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const PROJECT_ID = 'frota-moreno';

function b64u(s){return Buffer.from(s).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}

async function getFirebaseToken(){
  const now=Math.floor(Date.now()/1000);
  const h=b64u(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const p=b64u(JSON.stringify({iss:CLIENT_EMAIL,sub:CLIENT_EMAIL,aud:TOKEN_URI,iat:now,exp:now+3600,scope:'https://www.googleapis.com/auth/firebase.messaging'}));
  const sign=createSign('RSA-SHA256');
  sign.update(`${h}.${p}`);
  const sig=sign.sign(PRIVATE_KEY,'base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(TOKEN_URI,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${h}.${p}.${sig}`});
  return (await r.json()).access_token;
}

async function kvGet(key){
  try{const r=await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`,{headers:{Authorization:`Bearer ${UPSTASH_TOKEN}`}});const j=await r.json();return j.result?JSON.parse(j.result):null;}catch(e){return null;}
}

export default async function handler(req,res){
  const tokens=[];
  try{
    const r=await fetch(`${UPSTASH_URL}/keys/fcm_token_*`,{headers:{Authorization:`Bearer ${UPSTASH_TOKEN}`}});
    const j=await r.json();
    if(j.result&&j.result.length)for(const k of j.result){const t=await kvGet(k);if(t)tokens.push(t);}
  }catch(e){}
  if(!tokens.length)return res.json({ok:false,msg:'Nenhum token. Abra o site e toque no sino primeiro!'});
  const at=await getFirebase
