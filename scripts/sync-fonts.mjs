import { mkdir, writeFile } from 'node:fs/promises';

const families = [
  ['Space Grotesk', '400;500;600;700', 'spacegrotesk'],
  ['Syne', '600;700;800', 'syne'],
  ['Share Tech Mono', '400', 'sharetechmono'],
  ['Cinzel Decorative', '700', 'cinzeldecorative'],
  ['Cormorant Unicase', '600', 'cormorantunicase'],
  ['Oswald', '500', 'oswald'],
];
const dir = new URL('../public/fonts/', import.meta.url);
await mkdir(dir, { recursive: true });
let css = '/* Self-hosted Google Fonts; refresh with node scripts/sync-fonts.mjs. */\n';
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
};
const downloaded = new Map();
for (const [family, weights, slug] of families) {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${weights}&display=swap`,
    { headers }
  );
  if (!response.ok) throw new Error(`Font CSS: ${family} ${response.status}`);
  let sheet = await response.text();
  // Latin Extended includes Turkish glyphs; leave Cyrillic and other unused sets out.
  sheet = [...sheet.matchAll(/\/\* (latin(?:-ext)?) \*\/[\s\S]*?\}/g)]
    .map((match) => match[0])
    .join('\n');
  if (!sheet) throw new Error(`No Latin subsets: ${family}`);
  for (const url of [
    ...new Set([...sheet.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1])),
  ]) {
    let name = downloaded.get(url);
    if (!name) {
      name = `${slug}-${downloaded.size}.woff2`;
      const font = await fetch(url);
      if (!font.ok) throw new Error(`Font download: ${font.status}`);
      await writeFile(new URL(name, dir), Buffer.from(await font.arrayBuffer()));
      downloaded.set(url, name);
    }
    sheet = sheet.replaceAll(url, `./${name}`);
  }
  css += sheet + '\n';
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`
  );
  if (!license.ok) throw new Error(`Missing license: ${slug}`);
  await writeFile(new URL(`${slug}-OFL.txt`, dir), await license.text());
}
await writeFile(new URL('fonts.css', dir), css);
await writeFile(
  new URL('SOURCES.md', dir),
  'Fonts provided by Google Fonts, each under the included SIL Open Font License.\nRefresh script: scripts/sync-fonts.mjs.\n'
);
console.log(`Saved ${downloaded.size} font files.`);
