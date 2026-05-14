// Vercel Cron Job — roda a cada 5 minutos
// Verifica metas e envia push via Firebase FCM

const UPSTASH_URL   = 'https://splendid-ray-99496.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY || '';
const VAPID_KEY = 'BNvQYHTKiFxqtjZ5nxVxjPP7PL81lzxXhL1JbmXQ18RtTqfs2CzjAyRZ3K039FlPin-zcvpMT6Kf4eeQOQXeZZU';

async function kvGet(key) {
  try {
    const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const j = await r.json();
    return j.result ? JSON.parse(j.result) : null;
  } catch(e) { return null; }
}

async function kvSet(key, val) {
  try {
    await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(val))
    });
  } catch(e) {}
}

function calcProjecao(realizado) {
  const ag = new Date();
  let minD = (ag.getHours() * 60 + ag.getMinutes()) - 360;
  if (minD < 0) minD += 1440;
  const minR = 1440 - minD;
  if (minD <= 0 || realizado <= 0) return null;
  const med = realizado / minD;
  return { projecao: realizado + (med * minR), pct: null };
}

async function sendFCMPush(token, title, body) {
  if (!FIREBASE_SERVER_KEY) return;
  try {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FIREBASE_SERVER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: title,
          body: body,
          icon: '/icon-192.png',
          require_interaction: true,
          vibrate: [300, 100, 300]
        },
        priority: 'high'
      })
    });
  } catch(e) { console.log('FCM erro:', e); }
}

export default async function handler(req, res) {
  // Verificar cron secret
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    // Permitir chamada direta também para teste
  }

  const emps = ['CEM', 'CEMMA', 'COPLASA'];
  const alertas = [];

  // Buscar metas
  const metas = await kvGet('metas') || {};

  // Verificar caminhões
  for (const emp of emps) {
    const data = await kvGet(`${emp}_dia`);
    if (!data || !data.data || !data.data.length) continue;

    // Agrupar por proprietário
    const grouped = {};
    for (const row of data.data) {
      const k = row.ownerCode;
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
        alertas.push({ emp, nome: o.owner, pct, proj: proj.projecao.toFixed(0), meta });
      }
    }
  }

  // Verificar frentes
  for (const emp of emps) {
    const data = await kvGet(`entrega_${emp}`);
    if (!data || !data.data || !data.data.length) continue;
    for (const r of data.data) {
      const metaKey = `f_${r.codigo}`;
      const meta = metas[metaKey] || metas[`f_${parseInt(r.codigo)}`];
      if (!meta || !r.entrega || r.entrega <= 0) continue;
      const proj = calcProjecao(r.entrega);
      if (!proj) continue;
      if (proj.projecao < meta) {
        const pct = ((proj.projecao / meta) * 100).toFixed(0);
        alertas.push({ emp, nome: `Frente ${r.codigo} (${r.apelido})`, pct, proj: proj.projecao.toFixed(0), meta });
      }
    }
  }

  if (alertas.length === 0) {
    return res.json({ ok: true, alertas: 0, msg: 'Nenhuma meta em risco' });
  }

  // Buscar tokens FCM salvos
  const tokens = [];
  // Buscar todos os tokens salvos (chave fcm_token_*)
  try {
    const r = await fetch(`${UPSTASH_URL}/keys/fcm_token_*`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const j = await r.json();
    if (j.result) {
      for (const key of j.result) {
        const t = await kvGet(key);
        if (t) tokens.push(t);
      }
    }
  } catch(e) {}

  // Montar mensagem
  const title = `🚨 Alerta de Meta — ${alertas.length} abaixo`;
  const body = alertas.map(a => `${a.emp} · ${a.nome} — ${a.pct}% (proj: ${a.proj}t / meta: ${a.meta}t)`).join('\n');

  // Enviar para todos os tokens
  let enviados = 0;
  for (const token of tokens) {
    await sendFCMPush(token, title, body);
    enviados++;
  }

  return res.json({ ok: true, alertas: alertas.length, tokens: enviados, detalhes: alertas });
}
