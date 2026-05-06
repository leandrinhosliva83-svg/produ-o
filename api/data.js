const GITHUB_TOKEN = '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';
const REPO = 'leandrinhosliva83-svg/produ-o';
const BRANCH = 'main'; 

async function getFile(path) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/data/${path}.json`, {
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
  });
  if (r.status === 404) return { content: null, sha: null };
  const j = await r.json();
  const content = JSON.parse(Buffer.from(j.content, 'base64').toString('utf-8'));
  return { content, sha: j.sha };
}

async function saveFile(path, data, sha) {
  const content = Buffer.from(JSON.stringify(data)).toString('base64');
  const body = { message: `update ${path}`, content, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/data/${path}.json`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
    body: JSON.stringify(body)
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
