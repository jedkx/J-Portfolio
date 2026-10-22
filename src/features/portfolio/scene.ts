// Scroll geometry is shared by rendering, animation and regression tests.
export const NAV_OFFSET = 82;

export const projectStep = (height: number) => Math.max(180, Math.min(320, height * 0.28));
export const galleryIndexAt = (time: number, count: number) =>
  Math.max(0, Math.min(Math.max(0, count - 1), Math.floor(time + 0.42)));
export const galleryDistance = (height: number, count: number) =>
  Math.max(1, count) * projectStep(height);
