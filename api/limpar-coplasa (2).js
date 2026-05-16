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
  const per = req.query.per || 'todos';
  
  const resultados = {};
  
  if (per === 'todos') {
    // Apagar dia, d1, entrega e velocidade
    for (const p of ['dia', 'd1']) {
      resultados[emp+'_'+p] = await kset(emp+'_'+p, { data: [], updatedAt: '' });
    }
    resultados['entrega_'+emp] = await kset('entrega_'+emp, { data: [], updatedAt: '' });
    resultados['vel_'+emp] = await kset('vel_'+emp, null);
  } else {
    const key = emp + '_' + per;
    resultados[key] = await kset(key, { data: [], updatedAt: '' });
  }
  
  return res.json({ ok: true, msg: emp + ' limpo!', resultados });
}
