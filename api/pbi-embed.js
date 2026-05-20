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
  const auth = req.headers.get('authorization') || '';
  const resourceKey = req.headers.get('x-powerbi-resourcekey') || '';

  const res = await fetch(
    'https://wabi-brazil-south-b-primary-redirect.analysis.windows.net/public/reports/querydata?synchronous=true',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': auth,
        'X-PowerBI-ResourceKey': resourceKey,
        'Origin': 'https://app.powerbi.com',
        'Referer': 'https://app.powerbi.com/',
        'Accept': 'application/json, text/plain, */*',
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
