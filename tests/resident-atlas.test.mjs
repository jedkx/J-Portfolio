import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const json = async (name) =>
  JSON.parse(await readFile(new URL(`../art/resident/${name}.json`, import.meta.url), 'utf8'));
const atlas = await json('sheet');
const animation = await json('animation');
const source = (
  await readFile(new URL('../src/assets/residentAnimation.ts', import.meta.url), 'utf8')
)
  .replace(/^import atlas[^;]+;/m, `const atlas = ${JSON.stringify(atlas)};`)
  .replace(/^import animation[^;]+;/m, `const animation = ${JSON.stringify(animation)};`);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const {
  residentPupil,
  clipFrames,
  residentAction,
  residentBlink,
  residentSpeechFrame,
  residentSpokenWord,
  residentCanInteract,
  residentIdleCue,
  residentCanWake,
  residentReactionLines,
  residentEatingEyes,
} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('chewing never changes the eye silhouette or pupil size', () => {
  for (let frame = 26; frame <= 38; frame++) assert.deepEqual(residentEatingEyes(frame), [0, 0]);
  for (const frame of [0, 1, 14, 25, 39, 65]) assert.equal(residentEatingEyes(frame), undefined);
});

const introSource = (
  await readFile(new URL('../src/assets/residentIntro.ts', import.meta.url), 'utf8')
).replace(
  /^import[^;]+;/m,
  `const residentBlink = ${JSON.stringify(residentBlink)};
    const residentFrames = ${JSON.stringify(Object.values(atlas.frames))};`
);
const introCompiled = ts.transpileModule(introSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { residentIntro, residentIntroPoses, residentIntroBlinks } = await import(
  `data:text/javascript;base64,${Buffer.from(introCompiled).toString('base64')}`
);

test('intro bite, chewing, recovery and shutters have one ordered clock', () => {
  assert.ok(residentIntroBlinks.at(-1).at < residentIntro.prepare);
  const mouth = residentIntroPoses.filter((cue) => cue.at <= residentIntro.arrive).at(-1);
  assert.equal(mouth.frame, 29, 'mouth remains open while the letter arrives');
  assert.ok(residentIntro.consume > residentIntro.arrive + 0.18);
  const recovery = residentIntroPoses.at(-1);
  assert.equal(recovery.frame, 38);
  assert.ok(recovery.at + Object.values(atlas.frames)[38].duration / 1000 < residentIntro.close);
  assert.ok(residentIntro.close < residentIntro.closed);
  assert.ok(residentIntro.closed < residentIntro.ready);
});

test('sleep requires a real rest and meaningful movement or a deliberate tap', () => {
  assert.equal(residentCanWake(100, 500), false);
  assert.equal(residentCanWake(5999, 500), false);
  assert.equal(residentCanWake(9000, 5), false);
  assert.equal(residentCanWake(6000, 80), true);
  assert.equal(residentCanWake(1700, 0, true), false);
  assert.equal(residentCanWake(1800, 0, true), true);
  for (const reaction of ['sleepy', 'wake', 'search', 'curious', 'startle', 'surprised'])
    assert.ok(residentReactionLines[reaction].length >= 2);
});

test('shy hover never disables clicking, while eating remains protected', () => {
  for (const action of ['idle', 'shy', 'greet']) assert.equal(residentCanInteract(action), true);
  for (const action of ['sleep', 'prepare', 'eat', 'recover', 'farewell'])
    assert.equal(residentCanInteract(action), false);
});

test('ambient expressions are contextual, cooled down and silent during speech', () => {
  assert.equal(residentIdleCue(25000, 20000, false, false), 'sleepy');
  assert.equal(residentIdleCue(7000, 20000, false, false), 'search');
  assert.equal(residentIdleCue(1500, 20000, false, true), 'curious');
  assert.equal(residentIdleCue(1500, 20000, false, false), null);
  assert.equal(residentIdleCue(25000, 1000, false, true), null);
  assert.equal(residentIdleCue(25000, 20000, true, true), null);
  const state = {
    awake: true,
    departing: false,
    eating: false,
    anticipating: false,
    recovering: false,
    shy: false,
    greeting: false,
    ambient: true,
  };
  assert.equal(residentAction(state), 'ambient');
  assert.equal(residentAction({ ...state, eating: true }), 'eat');
  assert.equal(residentAction({ ...state, shy: true }), 'shy');
});

test('one face action wins when hover, greeting and loading inputs collide', () => {
  const state = {
    awake: true,
    departing: false,
    eating: false,
    anticipating: false,
    recovering: false,
    shy: false,
    greeting: false,
  };
  assert.equal(residentAction(state), 'idle');
  assert.equal(residentAction({ ...state, shy: true, greeting: true }), 'shy');
  assert.equal(
    residentAction({ ...state, shy: true, greeting: true, recovering: true }),
    'recover'
  );
  assert.equal(
    residentAction({ ...state, shy: true, greeting: true, anticipating: true }),
    'prepare'
  );
  assert.equal(
    residentAction({ ...state, shy: true, greeting: true, anticipating: true, eating: true }),
    'eat'
  );
  assert.equal(residentAction({ ...state, eating: true, departing: true }), 'farewell');
  assert.equal(residentAction({ ...state, awake: false, eating: true }), 'sleep');
});

test('frog-like blink overlaps lids without closing both eyes together', () => {
  let leftClosed = -1,
    rightClosed = -1,
    elapsed = 0;
  for (const [left, right, duration] of residentBlink) {
    assert.ok(!(left === 2 && right === 7), 'both eyes must not fully close together');
    if (left === 2) leftClosed = elapsed;
    if (right === 7) rightClosed = elapsed;
    elapsed += duration;
  }
  assert.ok(rightClosed > leftClosed);
  assert.ok(residentBlink.some(([left, right]) => left !== 0 && right !== 0));
  const firstRight = residentBlink.findIndex(([, right]) => right !== 0);
  assert.notEqual(residentBlink[firstRight][0], 0, 'right eye starts before left finishes');
});

test('word mouth pose stays stable while letters print and closes at punctuation', () => {
  const message = 'Hello, friend.';
  for (const prefix of ['H', 'He', 'Hel', 'Hell', 'Hello']) {
    assert.equal(residentSpokenWord(message, prefix), 'Hello');
    assert.equal(residentSpeechFrame(residentSpokenWord(message, prefix)), 52);
  }
  assert.equal(residentSpokenWord(message, 'Hello,'), '');
  assert.equal(residentSpeechFrame(''), 51);
  assert.notEqual(residentSpeechFrame('stay'), residentSpeechFrame('you'));
});

test('all named clips and independent layers share valid 68x40 frames and durations', async () => {
  const frames = Object.values(atlas.frames);
  assert.equal(frames.length, 103);
  assert.equal(Object.keys(animation.clips).length, 13);
  assert.deepEqual(
    animation.clips,
    Object.fromEntries(
      atlas.meta.frameTags.map((tag) => [tag.name, { from: tag.from, to: tag.to }])
    )
  );
  for (const name of Object.keys(animation.clips)) {
    const clip = clipFrames(name);
    assert.ok(clip.length);
    for (const index of clip) assert.ok(frames[index]?.duration > 0);
  }
  for (const layer of ['eye-left', 'eye-right', 'mouth']) {
    const data = await json(layer);
    const parts = Object.values(data.frames);
    assert.equal(parts.length, frames.length);
    parts.forEach((part, i) => {
      assert.deepEqual(part.frame, frames[i].frame);
      assert.equal(part.duration, frames[i].duration);
      assert.equal(part.trimmed, false);
      assert.deepEqual(part.sourceSize, { w: 68, h: 40 });
      assert.ok(part.frame.x + 68 <= data.meta.size.w);
      assert.ok(part.frame.y + 40 <= data.meta.size.h);
    });
  }
});

test('gaze cutouts remain inside the eye silhouette at every diagonal and invalid input', () => {
  const widths = [6, 10, 12, 14, 16, 16, 16, 16, 16, 16, 14, 12, 10, 6];
  for (const x of [-Infinity, -2, -1, -0.5, 0, 0.5, 1, 2, Infinity, NaN])
    for (const y of [-Infinity, -2, -1, -0.5, 0, 0.5, 1, 2, Infinity, NaN]) {
      const pupil = residentPupil({ x, y, active: true });
      for (let row = Math.floor(pupil.y) - 1; row <= Math.ceil(pupil.y + pupil.height); row++) {
        const edge = (16 - widths[row]) / 2;
        assert.ok(Number.isFinite(edge));
        assert.ok(pupil.x - edge >= 1);
        assert.ok(16 - edge - pupil.x - pupil.width >= 1);
      }
    }
  // Soft-blink frames retain their authored lids instead of being redrawn as open eyes.
  for (let index = 94; index < 103; index++) {
    assert.equal(animation.tracking.left.includes(index), false);
    assert.equal(animation.tracking.right.includes(index), false);
  }
});
