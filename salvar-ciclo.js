export const config = { runtime: 'edge' };

// Storage simples em memória (dura enquanto o worker estiver vivo)
// Usamos KV do Vercel Edge via globalThis
let dadosCiclo = null;
let ultimaAtualizacao = null;

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (req.method === 'POST') {
    const body = await req.text();
    dadosCiclo = body;
    ultimaAtualizacao = new Date().toISOString();
    return new Response(JSON.stringify({ ok: true, ts: ultimaAtualizacao }), { headers });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ 
      dados: dadosCiclo ? JSON.parse(dadosCiclo) : null,
      atualizado: ultimaAtualizacao 
    }), { headers });
  }
}
