import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './loadSource.mjs';
const { galleryIndexAt, projectStep, galleryDistance } = await loadSource(
  'features/portfolio/scene.ts'
);

test('gallery index remains bounded when scrolling backward, forward or with no repos', () => {
  for (const [time, count, index] of [
    [-10, 8, 0],
    [0, 8, 0],
    [0.57, 8, 0],
    [0.59, 8, 1],
    [7, 8, 7],
    [50, 8, 7],
    [50, 0, 0],
    [50, 1, 0],
  ])
    assert.equal(galleryIndexAt(time, count), index);
});
test('scene length matches compact repository steps and includes exactly one exit step', () => {
  for (const height of [600, 720, 844, 1200]) {
    assert.ok(projectStep(height) >= 180 && projectStep(height) <= 320);
    for (const count of [0, 1, 8, 100])
      assert.equal(galleryDistance(height, count), Math.max(1, count) * projectStep(height));
  }
});
