const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;
const API = '52.7.202.88';
const API_PORT = 3333;

// Armazenamento em memória (persiste enquanto o servidor estiver rodando)
let caminhoesCanaSalvos = [];

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {

    // Rota para salvar caminhões de cana
    if (req.url === '/caminhoes-cana' && req.method === 'POST') {
      try {
        const data = JSON.parse(body);
        caminhoesCanaSalvos = data.caminhoes || [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, total: caminhoesCanaSalvos.length }));
      } catch(e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Rota para carregar caminhões de cana
    if (req.url === '/caminhoes-cana' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ caminhoes: caminhoesCanaSalvos, total: caminhoesCanaSalvos.length }));
      return;
    }

    // Proxy normal para a API
    const targetPath = req.url;
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
