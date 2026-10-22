const clamp = (value: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : 0;

// A pointer event may be newer than the timestamp of its first RAF callback.
// Negative charge raised to a fractional power would poison the physics with NaN.
export const particleCharge = (now: number, start: number) => clamp((now - start) / 10000, 1.5);

export const particleColor = (palette: number[][], heat: number, energy = 1) => {
  const channels = palette[Math.round(clamp(heat, 1) * 64)] ?? [245, 245, 245];
  const blend = clamp(energy, 1);
  return channels.map((channel) => Math.round(245 + (channel - 245) * blend)).join(', ');
};
