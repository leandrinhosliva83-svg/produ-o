export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  const SCRIPT = 'https://script.google.com/macros/s/AKfycbw5x5dnauRVhhjetQq-PoX4CRDp9ATA_iVEvjkQ2B3wZWOUzokke3svZc3YJc38YTwL/exec';
  
  if (req.method === 'POST') {
    const { emp, per, data, updatedAt } = req.body;
    const form = new URLSearchParams({ emp, per, data: JSON.stringify(data), updatedAt });
    const r = await fetch(SCRIPT, { method: 'POST', body: form });
    const j = await r.json();
    return res.json(j);
  }
  
  const { emp, per } = req.query;
  const r = await fetch(`${SCRIPT}?emp=${emp}&per=${per}&t=${Date.now()}`);
  const j = await r.json();
  return res.json(j);
}
