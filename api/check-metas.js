// Vercel Cron Job — roda a cada 5 minutos
// Verifica metas e envia push via Firebase FCM API v1

const UPSTASH_URL   = 'https://splendid-ray-99496.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

const SERVICE_ACCOUNT = {
  project_id: "frota-moreno",
  private_key_id: "281e023c6210dd90ddb7c5a2bed3db0a315cba03",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNHGESlKANspub\nM9h75B7rjJCASzyVCIsHdiBlNjkK56bLXUUKjHab18hQ56dxzgX4TSTAayESIjGX\n4Q1GjExTWPyKS6Gg3+x6QkRsrvP7/4RtM4ssSg1rZeOIj/dmuFuC0CmU+If3+GhR\nbMK+a+um65p+6/XULbDfFTaFQfkigdGuAvL11Yy6XXOq11xHXcpxgTk8nCEYAgLQ\nsy23FKlrMftjA/blFS/wTe0/s/svag9J0FeKfU8Sy0YqaMQqSSX0hUONdpSiHVDx\nAGWGdh6AhUeuYns2gV0Rp89wkF7tTOQyyQQDoESGFzsuC5eTr3R1VNmQLll0IlY+\nLiyW/DAlAgMBAAECggEAKRVhID6i3HuFDY5R82bbBqVOIFRxmwxuBJ2VmZBF1rhV\nwXA6LwW5kDeliQcNlA8HRRf2n5AVvLMaqehLJ3FcrGkrlGvXwQh5LnftirN0bWpd\n1R2457MhgvySmbz0eh+9PLODULKDUZjxFDYrv8aQGgwhEwEiaVCJl/WAySpQw6dP\nAN/Ry+tYDwY7ChVjRtxXgI1hIYoJAOAzr3b4MWfaCXpasXAlMrsJh96AZbqeEt44\nIyynwd6d6xgnQn8lkG+Pqgc+M+75vmFWhSt4AAInzl8AfsvA0rna4qxZYGW92nig\nepeVfckWY2Q13cOI4JtG8YjI5a6apPwqt45qC/u1NQKBgQD5LFMYaAsMXW+/uQjm\nDZ2573yyuYbY4nkfdzLJx/umj7iuOGN0i6xQOnjnUiHfT2TWDIwpMeFuEmozW8Ch\ny/9hs0inZold7rlOoByhJFVHRKuZa6fvD637rgCixurpLqt8iMcwQ523770+3cVN\nLl1Mm8zXto3j348Af94JkSZr0wKBgQDSuwGSmOx+U9/CBMr7xN0sb78u6V3lai+A\nHIuwRrLpIMaLcJVDhFQZb/ngV/PlC8vUaEqUNpcp4qM3dTuvAP04W2P1x2JFDBBP\nLqAStnN0NoK0kE1OTVkXn4nXwb+MZs33rjfibXyRiAuGXgP41ie/f9QOSHwVA/ky\n1zHbt2xRJwKBgQCxwYYyFh8zngCXlIgdnj8UIx4hXist1Dq2UNHBk1IaW9NTLlT9\nEptFzMDtvPD/HuN/tAnVZYk9fhOXOfBtPFuetkixa3u5sBEwXxaten7/zaRhWaS+\n7b+fmV1IwoFZAntB5026R7JfQr8N9yXGzrmuakMy7D/C/XxFzfJ3fr4bEwKBgFvT\nnZXSCYvq5KBZElKvsGlCsJ6ylnX31YcP6VcBF8k6vQnaH1DygusqvkoiSWdPwpxm\nbck0GJ7p4ZGzBjT2S2GZgW+CWLIZ1amLebltw9WqQz6HewhZ8C65GInqJZv62FnL\nkxKZ/yQzkkIVCcoPF/b8rt0ifN9zgc3DtDg4L30VAoGBALl7vAQfEeOOkQe/ciJa\nqxrGB8DV6l/cNoZLh/w/A0o3kl7EcLZ8j+RHZLKF3PoSYUeWDAcjea8TGHsIyQ6c\n4PySBSkAGMlo9Od4IWBEIBhBDCuePaKmehDvYtTLjzWzYKWDVcjDafnIIk5gqrZV\n3kz9S62OYbZrgWvm7nxlt5U6\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@frota-moreno.iam.gserviceaccount.com",
  token_uri: "https://oauth2.googleapis.com/token"
};

// ── JWT para autenticação Firebase ────────────────────────────────────
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getFirebaseToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: SERVICE_ACCOUNT.client_email,
    sub: SERVICE_ACCOUNT.client_email,
    aud: SERVICE_ACCOUNT.token_uri,
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/firebase.messaging'
  }));

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(SERVICE_ACCOUNT.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const jwt = `${header}.${payload}.${sig}`;

  const r = await fetch(SERVICE_ACCOUNT.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const j = await r.json();
  return j.access_token;
}

// ── Upstash helpers ───────────────────────────────────────────────────
async function kvGet(key) {
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const j = await r.json();
    return j.result ? JSON.parse(j.result) : null;
  } catch(e) { return null; }
}

// ── Projeção ──────────────────────────────────────────────────────────
function calcProjecao(realizado) {
  const ag = new Date();
  let minD = (ag.getHours() * 60 + ag.getMinutes()) - 360;
  if (minD < 0) minD += 1440;
  const minR = 1440 - minD;
  if (minD <= 0 || realizado <= 0) return null;
  const med = realizado / minD;
  return { projecao: realizado + (med * minR) };
}

// ── Enviar push FCM v1 ────────────────────────────────────────────────
async function sendPush(token, title, body, accessToken) {
  try {
    const r = await fetch(
      `https://fcm.googleapis.com/v1/projects/frota-moreno/messages:send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: {
            token: token,
            notification: { title, body },
            android: { priority: 'high', notification: { sound: 'default', channel_id: 'alertas' } },
            apns: { payload: { aps: { sound: 'default', badge: 1 } } },
            webpush: {
              notification: { icon: '/icon-192.png', requireInteraction: true, vibrate: [300,100,300] },
              headers: { Urgency: 'high' }
            }
          }
        })
      }
    );
    const j = await r.json();
    if (!r.ok) console.log('FCM erro:', JSON.stringify(j));
    return r.ok;
  } catch(e) { console.log('FCM exception:', e); return false; }
}

// ── Handler principal ─────────────────────────────────────────────────
export default async function handler(req, res) {
  const emps = ['CEM', 'CEMMA', 'COPLASA'];
  const alertas = [];
  const metas = await kvGet('metas') || {};

  // Verificar caminhões
  for (const emp of emps) {
    const data = await kvGet(`${emp}_dia`);
    if (!data?.data?.length) continue;
    const grouped = {};
    for (const row of data.data) {
      const k = row.ownerCode || '';
      if (!grouped[k]) grouped[k] = { owner: row.owner, code: k, total: 0 };
      grouped[k].total += parseFloat(row.e || row.ton || 0) || 0;
    }
    for (const [code, o] of Object.entries(grouped)) {
      const meta = metas[code] || metas[String(parseInt(code))] || metas[code.padStart(4,'0')];
      if (!meta || o.total <= 0) continue;
      const proj = calcProjecao(o.total);
      if (!proj) continue;
      if (proj.projecao < meta) {
        const pct = ((proj.projecao / meta) * 100).toFixed(0);
        alertas.push(`${emp} · ${o.owner} — ${pct}% (proj: ${Math.round(proj.projecao)}t / meta: ${meta}t)`);
      }
    }
  }

  // Verificar frentes
  for (const emp of emps) {
    const data = await kvGet(`entrega_${emp}`);
    if (!data?.data?.length) continue;
    for (const r of data.data) {
      const meta = metas[`f_${r.codigo}`] || metas[`f_${parseInt(r.codigo)}`];
      if (!meta || !r.entrega) continue;
      const proj = calcProjecao(r.entrega);
      if (!proj) continue;
      if (proj.projecao < meta) {
        const pct = ((proj.projecao / meta) * 100).toFixed(0);
        alertas.push(`${emp} · Frente ${r.codigo} — ${pct}% (proj: ${Math.round(proj.projecao)}t / meta: ${meta}t)`);
      }
    }
  }

  if (!alertas.length) {
    return res.json({ ok: true, msg: 'Todas as metas no prazo' });
  }

  // Buscar tokens FCM
  const tokens = [];
  try {
    const r = await fetch(`${UPSTASH_URL}/keys/fcm_token_*`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const j = await r.json();
    if (j.result?.length) {
      for (const key of j.result) {
        const t = await kvGet(key);
        if (t) tokens.push(t);
      }
    }
  } catch(e) {}

  if (!tokens.length) {
    return res.json({ ok: true, alertas: alertas.length, msg: 'Sem tokens FCM registrados. Abra o app e ative o 🔔' });
  }

  // Obter access token Firebase
  const accessToken = await getFirebaseToken();

  // Enviar push
  const title = `🚨 Alerta de Meta — ${alertas.length} item(s)`;
  const body = alertas.slice(0, 5).join('\n');
  let enviados = 0;
  for (const token of tokens) {
    const ok = await sendPush(token, title, body, accessToken);
    if (ok) enviados++;
  }

  return res.json({ ok: true, alertas: alertas.length, tokens: tokens.length, enviados, detalhes: alertas });
}
