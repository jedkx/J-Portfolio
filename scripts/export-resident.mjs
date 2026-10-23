// Rebuild the committed runtime atlases from the single Aseprite source.
// node scripts/export-resident.mjs "C:/path/to/Aseprite.exe"
import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const executable = process.argv[2] || 'aseprite';
const root = fileURLToPath(new URL('../art/resident/', import.meta.url));
for (const name of ['sheet', 'eye-left', 'eye-right', 'mouth']) {
  const layers = name === 'sheet' ? ['eye-left', 'eye-right', 'mouth'] : [name];
  const result = spawnSync(
    executable,
    [
      '--batch',
      ...layers.flatMap((layer) => ['--layer', layer]),
      join(root, 'resident.aseprite'),
      '--list-tags',
      '--sheet-type',
      'rows',
      '--sheet-columns',
      '16',
      '--sheet',
      join(root, `${name}.png`),
      '--data',
      join(root, `${name}.json`),
    ],
    { encoding: 'utf8', windowsHide: true }
  );
  if (result.error || result.status !== 0) throw result.error || new Error(result.stderr);
}
const atlas = JSON.parse(await readFile(join(root, 'sheet.json'), 'utf8'));
const manifestPath = join(root, 'animation.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (!atlas.meta.frameTags?.length) throw new Error('Aseprite did not export animation tags');
manifest.clips = Object.fromEntries(
  atlas.meta.frameTags.map((tag) => [tag.name, { from: tag.from, to: tag.to }])
);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  'Resident atlases rebuilt. Run tests; update tracking indices if you inserted/reordered frames.'
);
