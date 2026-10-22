// Editorial labels supplement the live GitHub feed; descriptions stay sourced from GitHub.
const titles: Record<string, string> = {
  JedkxClicker: 'Jedkx Clicker',
  jedkxWTTG3: 'WTTG Assistant',
  'J-Portfolio': 'Dark Matter',
  'Jedkx-NewsPaper-Portfolio': 'Newspaper Portfolio',
  DxReportReview: 'Report Review',
};

export const projectTitle = (name: string) => titles[name] ?? name;
