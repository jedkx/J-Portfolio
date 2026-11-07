export const RUN_WIDTH = 480;
export const RUN_HEIGHT = 300;
export const RADAR_SCORE = 100;
export type Bonus = 'wide' | 'shield' | 'slow';
export interface RunBlock {
  x: number;
  y: number;
  vx: number;
  hp: number;
}
export interface RunDrop {
  x: number;
  y: number;
  kind: Bonus;
}
export interface RunEvent {
  x: number;
  y: number;
  kind: 'hit' | 'bonus' | 'shield';
}
export interface SignalRun {
  ball: { x: number; y: number; vx: number; vy: number };
  blocks: RunBlock[];
  drops: RunDrop[];
  score: number;
  elapsed: number;
  spawnIn: number;
  wideUntil: number;
  slowUntil: number;
  shield: boolean;
  over: boolean;
  seed: number;
}
export function createRun(seed = 12345): SignalRun {
  return {
    ball: { x: 240, y: 220, vx: 0.1, vy: -0.22 },
    blocks: [],
    drops: [],
    score: 0,
    elapsed: 0,
    spawnIn: 1000,
    wideUntil: 0,
    slowUntil: 0,
    shield: false,
    over: false,
    seed: seed >>> 0,
  };
}
const random = (game: SignalRun) => {
  game.seed = (Math.imul(game.seed, 1664525) + 1013904223) >>> 0;
  return game.seed / 4294967296;
};
export const runDifficulty = (elapsed: number) => Math.min(1, Math.max(0, elapsed) / 180000);
export const paddleWidth = (game: SignalRun) =>
  game.wideUntil > game.elapsed ? 130 : 104 - runDifficulty(game.elapsed) * 40;
export function stepRun(game: SignalRun, paddle: number, delta: number): RunEvent[] {
  const events: RunEvent[] = [];
  if (game.over) return events;
  const elapsed = Number.isFinite(delta) ? Math.max(0, Math.min(64, delta)) : 0;
  const count = Math.max(1, Math.ceil(elapsed / 6));
  for (let i = 0; i < count && !game.over; i++) {
    const dt = elapsed / count;
    game.elapsed += dt;
    game.spawnIn -= dt;
    const difficulty = runDifficulty(game.elapsed);
    const speed = (0.25 + difficulty * 0.36) * (game.slowUntil > game.elapsed ? 0.72 : 1);
    const ball = game.ball,
      previousX = ball.x,
      previousY = ball.y;
    const velocity = Math.hypot(ball.vx, ball.vy) || 1;
    ball.vx = (ball.vx / velocity) * speed;
    ball.vy = (ball.vy / velocity) * speed;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x < 6) {
      ball.x = 6;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x > 474) {
      ball.x = 474;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y < 6) {
      ball.y = 6;
      ball.vy = Math.abs(ball.vy);
    }
    if (game.spawnIn <= 0 && game.blocks.length < 18) {
      const gap = Math.floor(random(game) * 6);
      for (let lane = 0; lane < 6; lane++)
        if (lane !== gap && random(game) > 0.45) {
          game.blocks.push({
            x: 12 + lane * 78,
            y: -18,
            vx: game.elapsed > 25000 ? (random(game) - 0.5) * 0.045 : 0,
            hp: game.elapsed > 45000 && random(game) > 0.65 ? 2 : 1,
          });
        }
      game.spawnIn = 4200 - difficulty * 2700;
    }
    for (const block of game.blocks) {
      block.y += (0.012 + difficulty * 0.013) * dt;
      block.x += block.vx * dt;
      if (block.x < 4 || block.x > 410) block.vx *= -1;
      block.x = Math.max(4, Math.min(410, block.x));
      if (
        block.hp <= 0 ||
        ball.x + 6 < block.x ||
        ball.x - 6 > block.x + 64 ||
        ball.y + 6 < block.y ||
        ball.y - 6 > block.y + 14
      )
        continue;
      block.hp--;
      game.score += block.hp === 0 ? 20 : 5;
      events.push({ x: ball.x, y: ball.y, kind: 'hit' });
      if (previousY <= block.y) {
        ball.y = block.y - 6;
        ball.vy = -Math.abs(ball.vy);
      } else if (previousY >= block.y + 14) {
        ball.y = block.y + 20;
        ball.vy = Math.abs(ball.vy);
      } else if (previousX < block.x) {
        ball.x = block.x - 6;
        ball.vx = -Math.abs(ball.vx);
      } else {
        ball.x = block.x + 70;
        ball.vx = Math.abs(ball.vx);
      }
      if (block.hp === 0 && random(game) > 0.65)
        game.drops.push({
          x: block.x + 32,
          y: block.y,
          kind: (['wide', 'shield', 'slow'] as const)[Math.floor(random(game) * 3)],
        });
      break;
    }
    game.blocks = game.blocks.filter((block) => block.hp > 0 && block.y < 263);
    const half = paddleWidth(game) / 2;
    if (ball.vy > 0 && previousY <= 268 && ball.y >= 268 && Math.abs(ball.x - paddle) <= half + 6) {
      const offset = Math.max(-1, Math.min(1, (ball.x - paddle) / half));
      ball.y = 268;
      ball.vx = offset * speed * 0.85;
      ball.vy = -Math.sqrt(speed * speed - ball.vx * ball.vx);
      game.score += 10;
      events.push({ x: ball.x, y: 272, kind: 'hit' });
    }
    if (ball.y > 306) {
      if (game.shield) {
        game.shield = false;
        ball.y = 267;
        ball.vy = -Math.abs(ball.vy);
        events.push({ x: ball.x, y: 290, kind: 'shield' });
      } else game.over = true;
    }
    for (const drop of game.drops) {
      drop.y += 0.09 * dt;
      if (drop.y >= 265 && drop.y < 287 && Math.abs(drop.x - paddle) < half + 10) {
        if (drop.kind === 'wide') game.wideUntil = game.elapsed + 10000;
        if (drop.kind === 'slow') game.slowUntil = game.elapsed + 8000;
        if (drop.kind === 'shield') game.shield = true;
        drop.y = 999;
        events.push({ x: drop.x, y: 272, kind: 'bonus' });
      }
    }
    game.drops = game.drops.filter((drop) => drop.y < 310);
  }
  return events;
}
