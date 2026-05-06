const KV_URL = 'https://splendid-ray-99496.upstash.io';
const KV_TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

async function kv_get(key) {
  const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { 'Authorization': `Bearer ${KV_TOKEN}` }
  });
  const j = await r.json();
  if (!j.result) return null;
  return JSON.parse(j.result);
}

async function kv_set(key, value) {
  const r = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  return r.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const emp = req.method === 'POST' ? req.body.emp : req.query.emp;
    const per = req.method === 'POST' ? req.body.per : req.query.per;
    const key = `${emp}_${per}`;

    if (req.method === 'POST') {
      const { data, updatedAt } = req.body;
      await kv_set(key, { data, updatedAt });
      return res.status(200).json({ ok: true });
    }

    const result = await kv_get(key);
    return res.status(200).json(result || { data: [], updatedAt: '' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
