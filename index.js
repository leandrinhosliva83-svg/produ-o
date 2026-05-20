// Proxy Solinftec
if (req.url.startsWith('/slf03/')) {
  const options = {
    hostname: 'sgpa-api-br.saas-solinftec.com',
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      'Authorization': req.headers['authorization'] || '',
      'Cookie': req.headers['cookie'] || '',
      'Accept': 'application/json',
      'Accept-Language': 'pt-BR,pt;q=0.9'
    }
  };
  const proxy = https.request(options, (apiRes) => {
    let chunks = [];
    apiRes.on('data', chunk => chunks.push(chunk));
    apiRes.on('end', () => {
      res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(Buffer.concat(chunks));
    });
  });
  proxy.on('error', (e) => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
  proxy.end();
  return;
}
