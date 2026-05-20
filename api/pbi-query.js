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

  const res = await fetch(
    'https://0a5b357e3f5c470888c1606b76c406c0.pbidedicated.windows.net/webapi/capacities/0A5B357E-3F5C-4708-88C1-606B76C406C0/workloads/QES/QueryExecutionService/automatic/public/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': auth,
        'Origin': 'https://app.powerbi.com',
        'Referer': 'https://app.powerbi.com/',
        'activityid': crypto.randomUUID(),
        'requestid': crypto.randomUUID(),
        'x-ms-workload-resource-moniker': '6a656d58-4594-40d9-9d58-e56ce391a623',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.9',
        'priority': 'u=1, i',
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
