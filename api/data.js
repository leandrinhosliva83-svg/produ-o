const GITHUB_TOKEN = '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';
const REPO = 'leandrinhosliva83-svg/produ-o';
const BRANCH = 'main';

async function getFile(path) {
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/data/${path}.json`, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!r.ok) return { content: null, sha: null };
    const j = await r.json();
    if (!j.content) return { content: null, sha: null };
    const decoded = decodeURIComponent(escape(atob(j.content.replace(/\n/g, ''))));
    return { content: JSON.parse(decoded), sha: j.sha };
  } catch(e) {
    return { content: null, sha: null };
  }
}

async function saveFile(path, data, sha) {
  const str = JSON.stringify(data);
  const encoded = btoa(unescape(encodeURIComponent(str)));
  const body = { message: `update ${path}`, content: encoded, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/data/${path}.json`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(body)
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('GitHub ' + r.status + ': ' + txt.slice(0,200));
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const emp = req.method === 'POST' ? req.body.emp : req.query.emp;
    const per = req.method === 'POST' ? req.body.per : req.query.per;
    const path = `${emp}_${per}`;

    if (req.method === 'POST') {
      const { data, updatedAt } = req.body;
      const { sha } = await getFile(path);
      await saveFile(path, { data, updatedAt }, sha);
      return res.status(200).json({ ok: true });
    }

    const { content } = await getFile(path);
    return res.status(200).json(content || { data: [], updatedAt: '' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
