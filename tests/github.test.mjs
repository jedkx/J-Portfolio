import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Execute the production mapper without adding a test framework or emitted files.
const source = await readFile(new URL('../src/lib/github.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { mapRepository, fetchRepositories, findReadmePreview } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);

test('invalid records and employer projects cannot enter the public feed', () => {
  for (const value of [
    null,
    {},
    { id: 1, name: '../unsafe' },
    { id: 2, name: 'BELSISNET' },
    { id: 3, name: 'client', description: 'Belsis municipal platform' },
  ]) {
    assert.equal(mapRepository(value), null);
  }
  assert.deepEqual(
    mapRepository({ id: 4, name: 'Relay', language: 'Go', topics: ['webhooks', null] }),
    {
      id: 4,
      name: 'Relay',
      description: '',
      language: 'Go',
      topics: ['webhooks'],
      branch: 'main',
    }
  );
});

test('pagination loads all pages and deduplicates repository IDs', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    const data =
      calls.length === 1
        ? Array.from({ length: 100 }, (_, id) => ({ id, name: `project-${id}` }))
        : [
            { id: 99, name: 'project-99' },
            { id: 100, name: 'project-100' },
          ];
    return new Response(JSON.stringify(data));
  });
  const projects = await fetchRepositories(new AbortController().signal);
  assert.equal(projects.length, 101);
  assert.equal(calls.length, 2);
  assert.match(calls[1], /page=2$/);
});

test('rate limits and malformed responses produce a recoverable error', async (t) => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 403 }));
  await assert.rejects(fetchRepositories(new AbortController().signal), /403/);
  mocked.mock.mockImplementation(async () => new Response('{}'));
  await assert.rejects(fetchRepositories(new AbortController().signal), /Unexpected/);
});

test('README preview resolution supports relative and repository-root paths', () => {
  const project = mapRepository({ id: 1, name: 'demo', default_branch: 'main' });
  assert.equal(
    findReadmePreview('![Screenshot](./docs/preview.png)', project),
    'https://raw.githubusercontent.com/jedkx/demo/main/docs/preview.png'
  );
  assert.equal(
    findReadmePreview('<img src="/public/cover.png" alt="preview">', project),
    'https://raw.githubusercontent.com/jedkx/demo/main/public/cover.png'
  );
  assert.equal(
    findReadmePreview(
      '![Preview](https://github.com/jedkx/demo/blob/main/screenshot.png)',
      project
    ),
    'https://raw.githubusercontent.com/jedkx/demo/main/screenshot.png'
  );
});

test('badges, unsafe URLs and missing previews preserve the designed fallback', () => {
  const project = mapRepository({ id: 1, name: 'demo' });
  assert.equal(
    findReadmePreview(
      '![Preview](https://shields.io/preview.svg)\n![Screenshot](javascript:alert)\n![Cover](data:image/png;base64,abc)',
      project
    ),
    undefined
  );
  assert.equal(findReadmePreview('No images here.', project), undefined);
});
