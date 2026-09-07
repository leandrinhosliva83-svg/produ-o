// Proxy CORS para a API interna (AxiAgro / Usina Moreno)
// Recebe chamadas do app, repassa para a API e devolve a resposta
// com os cabeçalhos que o navegador exige.
//
// Sem dependências: usa só o que já vem no Node 18+.

const http = require('node:http');

// ---------- CONFIGURAÇÃO ----------
// Endereço da API interna. Pode ser trocado pela variável de ambiente API_URL.
const API_URL = process.env.API_URL || 'http://52.7.202.88:3333';

// Origens autorizadas a usar este proxy.
// IMPORTANTE: mantenha essa lista curta. Cada item aqui é alguém
// que pode chamar a API interna através deste servidor.
const ORIGENS_PERMITIDAS = (process.env.ORIGENS ||
  'http://usinamoreno.s3-website-us-east-1.amazonaws.com,http://localhost:3000,http://localhost:5500'
).split(',').map(s => s.trim());

const PORTA = process.env.PORT || 3000;
// ----------------------------------

function origemPermitida(origem) {
  if (!origem) return true;            // requisição sem origem (curl, health check)
  if (origem === 'null') return true;  // arquivo aberto direto do PC (file://)
  return ORIGENS_PERMITIDAS.includes(origem);
}

function aplicarCors(res, origem) {
  res.setHeader('Access-Control-Allow-Origin', origem || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const servidor = http.createServer(async (req, res) => {
  const origem = req.headers.origin;

  // Rota de teste: abrir no navegador para ver se está no ar
  if (req.url === '/' || req.url === '/health') {
    aplicarCors(res, origem);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', destino: API_URL }));
  }

  if (!origemPermitida(origem)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ erro: 'Origem não autorizada: ' + origem }));
  }

  aplicarCors(res, origem);

  // Pré-voo do CORS: o navegador pergunta antes se pode chamar
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Lê o corpo da requisição (usado no POST /sessions)
  const pedacos = [];
  for await (const p of req) pedacos.push(p);
  const corpo = Buffer.concat(pedacos);

  const destino = API_URL + req.url;

  try {
    const cabecalhos = { 'Content-Type': req.headers['content-type'] || 'application/json' };
    if (req.headers.authorization) cabecalhos.Authorization = req.headers.authorization;

    const resposta = await fetch(destino, {
      method: req.method,
      headers: cabecalhos,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : corpo,
    });

    const texto = await resposta.text();
    res.writeHead(resposta.status, {
      'Content-Type': resposta.headers.get('content-type') || 'application/json',
    });
    res.end(texto);

    console.log(req.method, req.url.split('?')[0], '→', resposta.status);
  } catch (e) {
    console.error('Falha ao chamar a API:', e.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ erro: 'Não consegui falar com a API', detalhe: e.message }));
  }
});

servidor.listen(PORTA, () => {
  console.log('Proxy rodando na porta ' + PORTA);
  console.log('Repassando para ' + API_URL);
  console.log('Origens liberadas: ' + ORIGENS_PERMITIDAS.join(', '));
});
