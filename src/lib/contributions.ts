export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
export function parseContributionDays(value: unknown): ContributionDay[] {
  if (
    !value ||
    typeof value !== 'object' ||
    !Array.isArray((value as Record<string, unknown>).contributions)
  )
    throw new Error('Invalid contribution response');
  const days = (value as { contributions: unknown[] }).contributions;
  return days.filter((day): day is ContributionDay => {
    if (!day || typeof day !== 'object') return false;
    const item = day as Record<string, unknown>;
    if (
      typeof item.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
      !Number.isFinite(Date.parse(item.date)) ||
      new Date(item.date).toISOString().slice(0, 10) !== item.date
    )
      return false;
    return (
      typeof item.count === 'number' &&
      Number.isSafeInteger(item.count) &&
      item.count >= 0 &&
      typeof item.level === 'number' &&
      Number.isInteger(item.level) &&
      item.level >= 0 &&
      item.level <= 4
    );
  });
}
