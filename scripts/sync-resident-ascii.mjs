// Mechanically synchronize the editable ASCII Motion files with the block sheet.
import fs from 'node:fs';
import { residentCanvas, residentFrames } from '../src/assets/residentBlockFrames.ts';

const asset = (name) => new URL(`../src/assets/${name}`, import.meta.url);
const frames = residentFrames.map((frame, index) => ({
  index,
  duration: frame.duration,
  cells: frame.lines.flatMap((line, y) =>
    Array.from(line).flatMap((char, x) =>
      char === ' ' ? [] : [{ x, y, char, color: '#e8e8eb', bgColor: 'transparent' }]
    )
  ),
}));
const session = JSON.parse(fs.readFileSync(asset('resident.asciimtn'), 'utf8'));
Object.assign(session.canvas, residentCanvas);
session.animation.frames = frames.map((frame, index) => ({
  ...session.animation.frames[index],
  name: `Block expression ${index}`,
  duration: frame.duration,
  data: Object.fromEntries(frame.cells.map(({ x, y, ...cell }) => [`${x},${y}`, cell])),
}));
session.animation.currentFrameIndex = 0;
fs.writeFileSync(asset('resident.asciimtn'), JSON.stringify(session, null, 2) + '\n');
fs.writeFileSync(
  asset('resident.ascii.json'),
  JSON.stringify(
    {
      version: '1.0',
      name: 'Hidden resident — block expression sheet',
      ...residentCanvas,
      frameRate: 12,
      frameCount: frames.length,
      frames,
    },
    null,
    2
  ) + '\n'
);
console.log(
  `Synchronized ${frames.length} block expressions (${residentCanvas.width}×${residentCanvas.height}).`
);
