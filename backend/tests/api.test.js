const { test, before, after, describe } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../app');

let server;
let baseUrl;

before((done) => {
  server = http.createServer(app);
  server.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

after((done) => {
  server.close(done);
});

async function fetchJson(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  return { status: res.status, body };
}

describe('Health Check', () => {
  test('GET /api/health returns ok', async () => {
    const { status, body } = await fetchJson('/api/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'ok');
    assert.ok(body.message);
  });
});

describe('Modules API', () => {
  test('GET /api/modules returns an array', async () => {
    const { status, body } = await fetchJson('/api/modules');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('POST /api/modules creates a new module', async () => {
    const { status, body } = await fetchJson('/api/modules', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Module', description: 'CI test', color: '#FF0000' }),
    });
    assert.equal(status, 201);
    assert.equal(body.name, 'Test Module');
    assert.ok(body.id);
  });

  test('POST /api/modules returns 400 when name is missing', async () => {
    const { status, body } = await fetchJson('/api/modules', {
      method: 'POST',
      body: JSON.stringify({ description: 'no name' }),
    });
    assert.equal(status, 400);
    assert.ok(body.error);
  });

  test('GET /api/modules/:id returns 404 for unknown id', async () => {
    const { status, body } = await fetchJson('/api/modules/999999');
    assert.equal(status, 404);
    assert.ok(body.error);
  });
});

describe('Todos API', () => {
  let moduleId;

  before(async () => {
    const { body } = await fetchJson('/api/modules', {
      method: 'POST',
      body: JSON.stringify({ name: 'Todo Test Module' }),
    });
    moduleId = body.id;
  });

  test('GET /api/modules/:id/todos returns an array', async () => {
    const { status, body } = await fetchJson(`/api/modules/${moduleId}/todos`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('POST /api/modules/:id/todos creates a todo', async () => {
    const { status, body } = await fetchJson(`/api/modules/${moduleId}/todos`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Test todo', priority: 'high' }),
    });
    assert.equal(status, 201);
    assert.equal(body.title, 'Test todo');
    assert.ok(body.id);
  });
});
