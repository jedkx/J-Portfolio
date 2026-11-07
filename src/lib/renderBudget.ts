/** Degrades decoration only after sustained slow rendering, never from one hiccup. */
export class RenderBudget {
  quality = 2;
  private samples = 0;
  private expensive = 0;
  sample(drawMs: number, frameMs: number) {
    if (!Number.isFinite(drawMs) || !Number.isFinite(frameMs)) return false;
    this.samples++;
    if (drawMs > 8 || frameMs > 30) this.expensive++;
    if (this.samples < 90) return false;
    const lower = this.expensive > 60 && this.quality > 0;
    this.samples = 0;
    this.expensive = 0;
    if (lower) this.quality--;
    return lower;
  }
}
