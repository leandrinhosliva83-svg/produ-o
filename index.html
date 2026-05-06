export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SCRIPT = 'https://script.google.com/macros/s/AKfycbw5x5dnauRVhhjetQq-PoX4CRDp9ATA_iVEvjkQ2B3wZWOUzokke3svZc3YJc38YTwL/exec';

  try {
    if (req.method === 'POST') {
      const { emp, per, data, updatedAt } = req.body;
      const form = new URLSearchParams({ emp, per, data: JSON.stringify(data), updatedAt: updatedAt || '' });
      const r = await fetch(SCRIPT, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString() });
      const j = await r.json();
      return res.status(200).json(j);
    }
    const { emp, per } = req.query;
    const r = await fetch(`${SCRIPT}?emp=${emp}&per=${per}&t=${Date.now()}`);
    const j = await r.json();
    return res.status(200).json(j);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
