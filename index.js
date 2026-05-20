const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API = '52.7.202.88';
const API_PORT = 3333;
const DATA_FILE = path.join('/tmp', 'caminhoes-cana.json');

// Carregar caminhões do arquivo ao iniciar
let caminhoesCanaSalvos = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    caminhoesCanaSalvos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log('Caminhões carregados:', caminhoesCanaSalvos.length);
  }
} catch(e) { console.log('Sem arquivo de caminhões'); }

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {

    // Salvar caminhões
    if (req.url === '/caminhoes-cana' && req.method === 'POST') {
      try {
        const data = JSON.parse(body);
        caminhoesCanaSalvos = data.caminhoes || [];
        fs.writeFileSync(DATA_FILE, JSON.stringify(caminhoesCanaSalvos));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, total: caminhoesCanaSalvos.length }));
      } catch(e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Carregar caminhões
    if (req.url === '/caminhoes-cana' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ caminhoes: caminhoesCanaSalvos, total: caminhoesCanaSalvos.length }));
      return;
    }

    // Proxy normal para a API
    const options = {
      hostname: API,
      port: API_PORT,
      path: req.url,
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
