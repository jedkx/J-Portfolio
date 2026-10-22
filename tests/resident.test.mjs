import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL('../src/assets/residentBlockFrames.ts', import.meta.url),
  'utf8'
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { trackedResidentLines, residentFrames } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const quadrants = [' ', '▘', '▝', '▀', '▖', '▌', '▞', '▛', '▗', '▚', '▐', '▜', '▄', '▙', '▟', '█'];
const eyePixels = (lines) =>
  Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 16 }, (_, x) =>
      Boolean(
        quadrants.indexOf(lines[3 + Math.floor(y / 2)][3 + Math.floor(x / 2)]) &
        (1 << ((y % 2) * 2 + (x % 2)))
      )
    )
  );

test('pupils retain an unbroken white rim at every pointer angle', () => {
  const base = eyePixels(residentFrames[0].lines);
  for (let y = 2; y < 6; y++) for (let x = 6; x < 10; x++) base[y][x] = true;
  for (let dy = -10; dy <= 10; dy++)
    for (let dx = -10; dx <= 10; dx++) {
      const pixels = eyePixels(trackedResidentLines(0, { x: dx / 10, y: dy / 10, active: true }));
      let pupil = 0;
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 16; x++) {
          if (!base[y][x]) assert.equal(pixels[y][x], false);
          if (base[y][x] && !pixels[y][x]) {
            pupil++;
            for (const [nx, ny] of [
              [x - 1, y],
              [x + 1, y],
              [x, y - 1],
              [x, y + 1],
            ])
              assert.equal(base[ny]?.[nx], true, `Broken rim at gaze ${dx},${dy}`);
          }
        }
      assert.equal(pupil, 16);
    }
});

test('tracking preserves closed expressions, mouth and asynchronous blinks', () => {
  const gaze = { x: 1, y: -1, active: true };
  for (const index of [2, 7, 8, 9, 10, 11, 12])
    assert.deepEqual(trackedResidentLines(index, gaze), residentFrames[index].lines);
  assert.deepEqual(trackedResidentLines(0, { ...gaze, active: false }), residentFrames[0].lines);
  assert.deepEqual(trackedResidentLines(0, gaze).slice(8), residentFrames[0].lines.slice(8));
  for (const row of [3, 4, 5, 6]) {
    assert.equal(
      trackedResidentLines(1, gaze)[row].slice(3, 11),
      residentFrames[1].lines[row].slice(3, 11)
    );
    assert.equal(
      trackedResidentLines(3, gaze)[row].slice(23, 31),
      residentFrames[3].lines[row].slice(23, 31)
    );
  }
});

test('vertical gaze thresholds do not move the pupil sideways', () => {
  const pupilColumns = (gaze) => {
    const pixels = eyePixels(trackedResidentLines(0, { ...gaze, active: true }));
    return pixels[3].map((white, x) => (!white ? x : -1)).filter((x) => x >= 0);
  };
  for (const x of [-1, -0.5, 0, 0.5, 1]) {
    assert.deepEqual(pupilColumns({ x, y: 0.49 }), pupilColumns({ x, y: 0.51 }));
    assert.deepEqual(pupilColumns({ x, y: -0.49 }), pupilColumns({ x, y: -0.51 }));
  }
});
