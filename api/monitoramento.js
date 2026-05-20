export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      }
    });
  }

  const body = await req.text();
  const authToken = req.headers.get('x-auth-token') || '';
  const url = new URL(req.url);
  const path = url.searchParams.get('path') || 'actual-state';

  const res = await fetch(
    `https://api-usa.saas-solinftec.com/monitoramento/v2/${path}?buId=101&language=pt-br`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
        'Referer': 'https://solinftec-frontends.saas-solinftec.com/',
        'Origin': 'https://solinftec-frontends.saas-solinftec.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5) AppleWebKit/537.36 Chrome/148.0.0.0 Mobile Safari/537.36'
      },
      body
    }
  );

  const data = await res.arrayBuffer();
  return new Response(data, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
