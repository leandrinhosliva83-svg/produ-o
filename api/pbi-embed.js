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

  // Tenta os dois endpoints
  const endpoints = [
    'https://wabi-brazil-south-b-primary-redirect.analysis.windows.net/public/reports/querydata?synchronous=true',
    'https://0a5b357e3f5c470888c1606b76c406c0.pbidedicated.windows.net/webapi/capacities/0A5B357E-3F5C-4708-88C1-606B76C406C0/workloads/QES/QueryExecutionService/automatic/public/query'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
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
      });

      if (res.status === 200) {
        const data = await res.arrayBuffer();
        return new Response(data, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    } catch(e) {
      continue;
    }
  }

  return new Response(JSON.stringify({error: 'ambos endpoints falharam'}), {
    status: 403,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
