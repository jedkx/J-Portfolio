import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './loadSource.mjs';
const { particleCharge, particleColor } = await loadSource('lib/particleColor.ts');

test('a RAF timestamp older than pointerdown cannot create negative charge or NaN force', () => {
  for (const [now, start, expected] of [
    [99, 100, 0],
    [100, 100, 0],
    [5100, 100, 0.5],
    [20100, 100, 1.5],
  ]) {
    const charge = particleCharge(now, start);
    assert.equal(charge, expected);
    assert.ok(Number.isFinite(Math.pow(charge, 1.4)));
  }
});

test('particle colors remain valid before palette initialization and for invalid heat', () => {
  const palette = Array.from({ length: 65 }, () => [255, 85, 85]);
  assert.equal(particleColor([], 0.5), '245, 245, 245');
  assert.equal(particleColor(palette, NaN), '255, 85, 85');
  assert.equal(particleColor(palette, Infinity), '255, 85, 85');
  assert.equal(particleColor(palette, -1, 0), '245, 245, 245');
  assert.equal(particleColor(palette, 10, 2), '255, 85, 85');
});
