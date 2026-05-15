import { createSign } from 'crypto';

const UPSTASH_URL   = 'https://splendid-ray-99496.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

const PK = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNHGESlKANspub
M9h75B7rjJCASzyVCIsHdiBlNjkK56bLXUUKjHab18hQ56dxzgX4TSTAayESIjGX
4Q1GjExTWPyKS6Gg3+x6QkRsrvP7/4RtM4ssSg1rZeOIj/dmuFuC0CmU+If3+GhR
bMK+a+um65p+6/XULbDfFTaFQfkigdGuAvL11Yy6XXOq11xHXcpxgTk8nCEYAgLQ
sy23FKlrMftjA/blFS/wTe0/s/svag9J0FeKfU8Sy0YqaMQqSSX0hUONdpSiHVDx
AGWGdh6AhUeuYns2gV0Rp89wkF7tTOQyyQQDoESGFzsuC5eTr3R1VNmQLll0IlY+
LiyW/DAlAgMBAAECggEAKRVhID6i3HuFDY5R82bbBqVOIFRxmwxuBJ2VmZBF1rhV
wXA6LwW5kDeliQcNlA8HRRf2n5AVvLMaqehLJ3FcrGkrlGvXwQh5LnftirN0bWpd
1R2457MhgvySmbz0eh+9PLODULKDUZjxFDYrv8aQGgwhEwEiaVCJl/WAySpQw6dP
AN/Ry+tYDwY7ChVjRtxXgI1hIYoJAOAzr3b4MWfaCXpasXAlMrsJh96AZbqeEt44
Iyynwd6d6xgnQn8lkG+Pqgc+M+75vmFWhSt4AAInzl8AfsvA0rna4qxZYGW92nig
epeVfckWY2Q13cOI4JtG8YjI5a6apPwqt45qC/u1NQKBgQD5LFMYaAsMXW+/uQjm
DZ2573yyuYbY4nkfdzLJx/umj7iuOGN0i6xQOnjnUiHfT2TWDIwpMeFuEmozW8Ch
y/9hs0inZold7rlOoByhJFVHRKuZa6fvD637rgCixurpLqt8iMcwQ523770+3cVN
Ll1Mm8zXto3j348Af94JkSZr0wKBgQDSuwGSmOx+U9/CBMr7xN0sb78u6V3lai+A
HIuwRrLpIMaLcJVDhFQZb/ngV/PlC8vUaEqUNpcp4qM3dTuvAP04W2P1x2JFDBBP
LqAStnN0NoK0kE1OTVkXn4nXwb+MZs33rjfibXyRiAuGXgP41ie/f9QOSHwVA/ky
1zHbt2xRJwKBgQCxwYYyFh8zngCXlIgdnj8UIx4hXist1Dq2UNHBk1IaW9NTLlT9
EptFzMDtvPD/HuN/tAnVZYk9fhOXOfBtPFuetkixa3u5sBEwXxaten7/zaRhWaS+
7b+fmV1IwoFZAntB5026R7JfQr8N9yXGzrmuakMy7D/C/XxFzfJ3fr4bEwKBgFvT
nZXSCYvq5KBZElKvsGlCsJ6ylnX31YcP6VcBF8k6vQnaH1DygusqvkoiSWdPwpxm
bck0GJ7p4ZGzBjT2S2GZgW+CWLIZ1amLebltw9WqQz6HewhZ8C65GInqJZv62FnL
kxKZ/yQzkkIVCcoPF/b8rt0ifN9zgc3DtDg4L30VAoGBALl7vAQfEeOOkQe/ciJa
qxrGB8DV6l/cNoZLh/w/A0o3kl7EcLZ8j+RHZLKF3PoSYUeWDAcjea8TGHsIyQ6c
4PySBSkAGMlo9Od4IWBEIBhBDCuePaKmehDvYtTLjzWzYKWDVcjDafnIIk5gqrZV
3kz9S62OYbZrgWvm7nxlt5U6
-----END PRIVATE KEY-----`;

const CE   = 'firebase-adminsdk-fbsvc@frota-moreno.iam.gserviceaccount.com';
const TU   = 'https://oauth2.googleapis.com/token';
const PROJ = 'frota-moreno';

function b64u(s) {
  return Buffer.from(s).toString('base64')
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

async function getFBToken() {
  const now = Math.floor(Date.now()/1000);
  const h = b64u(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const p = b64u(JSON.stringify({iss:CE,sub:CE,aud:TU,iat:now,exp:now+3600,scope:'https://www.googleapis.com/auth/firebase.messaging'}));
  const s = createSign('RSA-SHA256');
  s.update(h+'.'+p);
  const sig = s.sign(PK,'base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r = await fetch(TU,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+h+'.'+p+'.'+sig});
  return (await r.json()).access_token;
}

async function kget(key) {
  try {
    const r = await fetch(UPSTASH_URL+'/get/'+encodeURIComponent(key),{headers:{Authorization:'Bearer '+UPSTASH_TOKEN}});
    const j = await r.json();
    return j.result ? JSON.parse(j.result) : null;
  } catch(e) { return null; }
}

async function kset(key,val) {
  try {
    await fetch(UPSTASH_URL+'/set/'+encodeURIComponent(key),{method:'POST',headers:{Authorization:'Bearer '+UPSTASH_TOKEN,'Content-Type':'application/json'},body:JSON.stringify(JSON.stringify(val))});
  } catch(e) {}
}

function calcProj(real) {
  const ag = new Date();
  let minD = (ag.getHours()*60+ag.getMinutes())-360;
  if (minD < 1) return null;
  return { proj: real + (real/minD) * (1440-minD) };
}

async function sendPush(token, title, body, at) {
  try {
    const r = await fetch('https://fcm.googleapis.com/v1/projects/'+PROJ+'/messages:send',{
      method:'POST',
      headers:{Authorization:'Bearer '+at,'Content-Type':'application/json'},
      body:JSON.stringify({message:{token,notification:{title,body},android:{priority:'high',notification:{sound:'default',channel_id:'alertas'}},apns:{payload:{aps:{sound:'default',badge:1}}},webpush:{headers:{Urgency:'high'},notification:{icon:'/icon-192.png',requireInteraction:true}}}})
    });
    return r.ok;
  } catch(e) { return false; }
}

async function getTokensAtivos() {
  const tokens = [];
  try {
    const r1 = await fetch(UPSTASH_URL+'/keys/fcm_usr_*',{headers:{Authorization:'Bearer '+UPSTASH_TOKEN}});
    const j1 = await r1.json();
    if (j1.result?.length) {
      for (const key of j1.result) {
        const d = await kget(key);
        if (d && d.ativo !== false && d.token) tokens.push(d.token);
      }
    }
    if (!tokens.length) {
      const r2 = await fetch(UPSTASH_URL+'/keys/fcm_token_*',{headers:{Authorization:'Bearer '+UPSTASH_TOKEN}});
      const j2 = await r2.json();
      if (j2.result?.length) {
        for (const key of j2.result) {
          const t = await kget(key);
          if (t) tokens.push(t);
        }
      }
    }
  } catch(e) {}
  return tokens;
}

export default async function handler(req, res) {
  const intervalo = await kget('intervalo_push') || 5;
  const ultimoPush = await kget('ultimo_push') || 0;
  const diffMin = (Date.now()-ultimoPush)/60000;

  if (diffMin < intervalo && req.query.force !== '1') {
    return res.json({ok:true, msg:`Aguardando ${Math.ceil(intervalo-diffMin)} min`});
  }

  const emps = ['CEM','CEMMA','COPLASA'];
  const metas = await kget('metas') || {};
  const alertas = [];

  for (const emp of emps) {
    const data = await kget('entrega_'+emp);
    if (!data?.data?.length) continue;
    for (const r of data.data) {
      const cod = String(r.codigo||'').trim();
      const meta = metas['f_'+cod]
        || metas['f_'+parseInt(cod)]
        || metas['f_'+cod.padStart(4,'0')]
        || metas['f_'+cod.replace(/^0+/,'')];
      if (!meta || !(r.entrega > 0)) continue;
      const p = calcProj(r.entrega);
      if (!p) continue;
      const pct = Math.round((p.proj/meta)*100);
      if (pct < 100) {
        const nome = r.apelido || ('Frente '+cod);
        alertas.push(`${emp} | ${nome}\nProj: ${Math.round(p.proj)}t / Meta: ${meta}t (${pct}%)`);
      }
    }
  }

  if (!alertas.length) {
    return res.json({ok:true, msg:'Todas as frentes no prazo'});
  }

  const tokens = await getTokensAtivos();
  if (!tokens.length) {
    return res.json({ok:false, alertas:alertas.length, msg:'Sem tokens ativos'});
  }

  const qtd = alertas.length;
  const title = `🚨 Grupo Moreno — ${qtd} frente${qtd>1?'s':''} abaixo da meta`;
  const body = alertas.slice(0,4).join('\n─────────\n');

  const at = await getFBToken();
  let enviados = 0;
  for (const token of tokens) {
    if (await sendPush(token, title, body, at)) enviados++;
  }

  if (enviados > 0) await kset('ultimo_push', Date.now());

  return res.json({ok:true, alertas:qtd, tokens:tokens.length, enviados, detalhes:alertas});
}
