// api/limpar-coplasa.js — apagar após usar!
const URL   = 'https://splendid-ray-99496.upstash.io';
const TOKEN = 'gQAAAAAAAYSoAAIgcDI0Mjk3MjcwYTJiYWQ0ZDExYTE3YTMzMzc1MzBhMTZmNw';

async function kset(key, val) {
  await fetch(URL+'/set/'+encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer '+TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(val))
  });
}

export default async function handler(req, res) {
  const emp = req.query.emp || 'COPLASA';
  const per = req.query.per || 'd1';
  await kset(emp+'_'+per, { data: [], updatedAt: '' });
  return res.json({ ok: true, msg: emp+'_'+per+' apagado!' });
}
