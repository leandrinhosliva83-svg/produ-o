const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, activityid, requestid, x-ms-parent-activity-id, x-ms-root-activity-id, x-ms-workload-resource-moniker');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.url === '/pbi-query') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const options = {
        hostname: '0a5b357e3f5c470888c1606b76c406c0.pbidedicated.windows.net',
        port: 443,
        path: '/webapi/capacities/0A5B357E-3F5C-4708-88C1-606B76C406C0/workloads/QES/QueryExecutionService/automatic/public/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers['authorization'] || '',
          'Origin': 'https://app.powerbi.com',
          'Referer': 'https://app.powerbi.com/',
          'activityid': req.headers['activityid'] || '',
          'requestid': req.headers['requestid'] || '',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxy = https.request(options, (apiRes) => {
        res.writeHead(apiRes.statusCode, {
          'Content-Type': 'application/json',
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
    return;
  }

  // Proxy original para API Exiagro
  const API = '52.7.202.88';
  const API_PORT = 3333;
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
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
