import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './loadSource.mjs';
const { createRun, stepRun, runDifficulty, paddleWidth, RADAR_SCORE } =
  await loadSource('lib/signalRun.ts');
test('endless difficulty increases continuously within playable bounds', () => {
  const game = createRun(7);
  assert.equal(runDifficulty(0), 0);
  assert.equal(runDifficulty(90000), 0.5);
  assert.equal(runDifficulty(9999999), 1);
  game.elapsed = 9999999;
  assert.ok(paddleWidth(game) >= 64);
  for (let i = 0; i < 10000; i++) {
    if (game.over) {
      game.over = false;
      game.ball = { x: 240, y: 220, vx: 0.1, vy: -0.22 };
    }
    stepRun(game, Math.max(52, Math.min(428, game.ball.x)), 16);
    assert.ok([game.ball.x, game.ball.y, game.ball.vx, game.ball.vy].every(Number.isFinite));
    assert.ok(game.blocks.length <= 23 && game.drops.length < 24);
  }
});
test('score unlock threshold does not end a run; shield and bonuses have bounded effects', () => {
  const game = createRun(9);
  game.score = RADAR_SCORE;
  game.ball = { x: 240, y: 266, vx: 0, vy: 0.25 };
  stepRun(game, 240, 16);
  assert.ok(game.score > RADAR_SCORE);
  assert.equal(game.over, false);
  game.shield = true;
  game.ball = { x: 5, y: 307, vx: 0, vy: 0.25 };
  stepRun(game, 240, 16);
  assert.equal(game.shield, false);
  assert.equal(game.over, false);
  assert.ok(game.ball.vy < 0);
  game.drops = [{ x: 240, y: 266, kind: 'wide' }];
  stepRun(game, 240, 16);
  assert.equal(paddleWidth(game), 130);
  game.elapsed = game.wideUntil + 1;
  assert.ok(paddleWidth(game) < 130);
});
test('render budget ignores one slow frame and only degrades for sustained pressure', async () => {
  const { RenderBudget } = await loadSource('lib/renderBudget.ts');
  const budget = new RenderBudget();
  budget.sample(50, 80);
  for (let i = 0; i < 100; i++) budget.sample(2, 16);
  assert.equal(budget.quality, 2);
  for (let i = 0; i < 300; i++) budget.sample(15, 40);
  assert.equal(budget.quality, 0);
  for (let i = 0; i < 300; i++) budget.sample(15, 40);
  assert.equal(budget.quality, 0);
});
