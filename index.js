const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const API = '52.7.202.88';
const API_PORT = 3333;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Montar URL do destino
  const targetPath = req.url;
  let body = '';

  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const options = {
      hostname: API,
      port: API_PORT,
      path: targetPath,
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const proxy = http.request(options, (apiRes) => {
      res.writeHead(apiRes.statusCode, {
        'Content-Type': apiRes.headers['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      apiRes.pipe(res);
    });

    proxy.on('error', (e) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });

    if (body) proxy.write(body);
    proxy.end();
  });
});

server.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
