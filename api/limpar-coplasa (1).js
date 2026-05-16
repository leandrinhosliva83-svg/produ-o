const URL   = 'https://splendid-ray-99496.upstash.io';
const TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

async function kset(key, val) {
  const r = await fetch(URL+'/set/'+encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer '+TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(val))
  });
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const emp = req.query.emp || 'COPLASA';
  const per = req.query.per || 'd1';
  const key = emp + '_' + per;
  const result = await kset(key, { data: [], updatedAt: '' });
  return res.json({ ok: true, msg: key + ' apagado!', result });
}
