import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './loadSource.mjs';
const { parseProjectCache } = await loadSource('lib/projectCache.ts');
const { parseContributionDays } = await loadSource('lib/contributions.ts');
const { requestJson } = await loadSource('lib/request.ts');
const project = {
  id: 1,
  name: 'demo',
  description: 'Demo',
  topics: [],
  branch: 'main',
  language: null,
};

test('cache rejects malformed records, future timestamps and non-string topics', () => {
  for (const value of [
    null,
    {},
    { savedAt: 101, projects: [project] },
    { savedAt: 10, projects: [null] },
    { savedAt: 10, projects: [{ ...project, topics: [null] }] },
  ])
    assert.equal(parseProjectCache(value, 100), null);
});
test('cache deduplicates, filters employer projects and drops unsafe previews', () => {
  const cache = parseProjectCache(
    {
      savedAt: 10,
      projects: [
        { ...project, imageUrl: 'javascript:alert(1)' },
        project,
        { ...project, id: 2, name: 'Belsis' },
      ],
    },
    100
  );
  assert.equal(cache.projects.length, 1);
  assert.equal(cache.projects[0].imageUrl, undefined);
  assert.equal(
    parseProjectCache(
      { savedAt: 10, projects: [{ ...project, imageUrl: 'https://example.com/preview.png' }] },
      100
    ).projects[0].imageUrl,
    'https://example.com/preview.png'
  );
});
test('contribution API validation rejects malformed payloads and impossible days', () => {
  assert.throws(() => parseContributionDays({}), /Invalid/);
  assert.deepEqual(
    parseContributionDays({
      contributions: [
        null,
        { date: '2026-02-31', count: 1, level: 1 },
        { date: '2026-02-01', count: 1, level: 20 },
        { date: '2026-02-01', count: 2, level: 1 },
      ],
    }),
    [{ date: '2026-02-01', count: 2, level: 1 }]
  );
});
test('bounded requests surface HTTP errors and timeouts', async (t) => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(requestJson('https://example.com', new AbortController().signal), /503/);
  mocked.mock.mockImplementation(
    (url, { signal }) =>
      new Promise((resolve, reject) =>
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
          once: true,
        })
      )
  );
  await assert.rejects(requestJson('https://example.com', new AbortController().signal, 10), {
    name: 'TimeoutError',
  });
});
test('caller cancellation is not mistaken for a timeout', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    (url, { signal }) =>
      new Promise((resolve, reject) =>
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
          once: true,
        })
      )
  );
  const controller = new AbortController();
  const request = requestJson('https://example.com', controller.signal);
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
});
