const http = require('http');

async function assertJsonResponse(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, received ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON response, received content-type: ${contentType}`);
  }

  return response.json();
}

async function runChecks(baseUrl) {
  const root = await assertJsonResponse(await fetch(`${baseUrl}/`), 200);
  if (root.message !== 'Backend is up' || root.api !== '/api') {
    throw new Error('Unexpected root response payload');
  }

  const apiIndex = await assertJsonResponse(await fetch(`${baseUrl}/api`), 200);
  if (apiIndex.message !== 'Aditya Tours & Travels API' || apiIndex.version !== '1.0.0') {
    throw new Error('Unexpected /api response payload');
  }

  const notFound = await assertJsonResponse(await fetch(`${baseUrl}/api/does-not-exist`), 404);
  if (!String(notFound.message || '').includes('Route not found')) {
    throw new Error('Unexpected 404 payload');
  }

  console.log(`Smoke test passed for ${baseUrl}`);
}

function getBaseUrlArg() {
  const flagIndex = process.argv.indexOf('--base-url');
  if (flagIndex === -1) return '';
  return process.argv[flagIndex + 1] || '';
}

async function runRemoteSmokeTest(baseUrl) {
  if (!baseUrl) {
    throw new Error('Missing value for --base-url');
  }

  await runChecks(baseUrl.replace(/\/$/, ''));
}

async function runLocalSmokeTest() {
  const app = require('../src/app');

  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to determine local smoke test address');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await runChecks(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

async function main() {
  const baseUrl = getBaseUrlArg();

  if (baseUrl) {
    await runRemoteSmokeTest(baseUrl);
    return;
  }

  await runLocalSmokeTest();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});