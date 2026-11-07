import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
assert.match(html, /<title>Caner Coşkun \| Portfolio<\/title>/);
assert.doesNotMatch(html, /dark matter|nostromo|fonts\.googleapis\.com/i);
const paths = [...html.matchAll(/(?:href|src)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)].map(
  (match) => match[1]
);
for (const path of paths) {
  assert.ok(path.startsWith('/J-Portfolio/'), `Wrong base path: ${path}`);
  const relative = path.slice('/J-Portfolio/'.length);
  assert.ok(!relative.includes('..'), 'Asset path escapes build');
  await access(new URL(relative, root));
}
for (const file of [
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'og-image.png',
  'fonts/fonts.css',
])
  await access(new URL(file, root));
const fonts = await readFile(new URL('fonts/fonts.css', root), 'utf8');
assert.doesNotMatch(fonts, /https?:/);
for (const match of fonts.matchAll(/url\(([^)]+)\)/g))
  await access(new URL(match[1], new URL('fonts/', root)));
assert.match(html, /HELLO/);
assert.match(html, /mailto:ccoskun742@gmail\.com/);
console.log(
  `Build assets verified (${paths.length} HTML references, local fonts, icons and social image).`
);
