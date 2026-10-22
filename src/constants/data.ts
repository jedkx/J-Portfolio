// ============================================
// DATA CONSTANTS - Portfolio Content
// ============================================

import type { Education, Experience, NavItem, Skill, SocialLink } from '@/types';

export const SKILLS: Skill[] = [
  { name: 'C', level: 85, category: 'backend' },
  { name: 'C#', level: 88, category: 'backend' },
  { name: 'JavaScript', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Python', level: 80, category: 'backend' },
  { name: 'GDScript', level: 75, category: 'backend' },
  { name: 'ASP.NET Core', level: 88, category: 'backend' },
  { name: 'MVC', level: 85, category: 'backend' },
  { name: 'Entity Framework', level: 85, category: 'backend' },
  { name: 'React', level: 88, category: 'frontend' },
  { name: 'Bootstrap', level: 88, category: 'frontend' },
  { name: 'Tailwind CSS', level: 90, category: 'frontend' },
  { name: 'Git', level: 88, category: 'tools' },
  { name: 'Docker', level: 75, category: 'tools' },
  { name: 'Jira', level: 85, category: 'tools' },
  { name: 'GitLab', level: 82, category: 'tools' },
  { name: 'DevExpress', level: 80, category: 'tools' },
  { name: 'Scrum/Agile', level: 85, category: 'tools' },
  { name: 'SQL Server', level: 82, category: 'backend' },
  { name: 'Premiere Pro', level: 95, category: 'tools' },
  { name: 'After Effects', level: 90, category: 'tools' },
  { name: 'Photoshop', level: 92, category: 'tools' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/jedkx', icon: 'Github' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/caner-co%C5%9Fkun/', icon: 'Linkedin' },
  { label: 'Medium', url: 'https://medium.com/@ccoskun742', icon: 'BookOpen' },
  { label: 'Email', url: 'mailto:ccoskun742@gmail.com', icon: 'Mail' },
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
  { label: 'WHO’S THERE?', href: '#whos-there' },
];

export const TYPEWRITER_TEXTS = [
  'Full-Stack Developer at Belsis',
  'Software Engineering Student at Atilim',
  'Video Editor with 6+ Years Experience',
  'Cybersecurity & Ethical Hacking Enthusiast',
];

export const CONTACT_EMAIL = 'ccoskun742@gmail.com';

export const EXPERIENCE: Experience[] = [
  {
    role: 'Full-Stack Developer',
    company: 'Belsis',
    period: '2025 - Present',
    description:
      'Enterprise municipal reporting platform serving 200+ municipalities across Turkey. Role-based authorization, dynamic report management, and 50% performance optimization through caching.',
    tech: ['ASP.NET Core', 'DevExpress', 'Entity Framework', 'SQL Server', 'MVC', 'Scrum/Agile'],
  },
];

export const EDUCATION: Education[] = [
  {
    degree: 'B.Sc. Software Engineering',
    school: 'Atilim University',
    period: '2021 - 2026',
    location: 'Ankara, Turkey',
    note: 'Expected graduation 2026',
  },
];

export const MANIFESTO_QUOTE = 'One Code to rule them all.';

export const MANIFESTO_ITEMS = [
  {
    text: 'ACCIO SOLUTION',
    reference: 'wizard',
    title: 'Harry Potter',
    href: 'https://www.harrypotter.com/',
    color: '#d4b275',
    font: '"Cinzel Decorative", Georgia, serif',
    fontWeight: '700',
  },
  {
    text: 'HELLO FRIEND',
    reference: 'hacker',
    title: 'Mr. Robot',
    href: 'https://www.imdb.com/title/tt4158110/',
    color: '#f34848',
    font: '"Share Tech Mono", monospace',
    fontWeight: '400',
  },
  {
    text: 'SHALL NOT PASS',
    reference: 'middleearth',
    title: 'The Lord of the Rings',
    href: 'https://www.warnerbros.com/movies/lord-rings-fellowship-ring',
    color: '#a9b58a',
    font: '"Cormorant Unicase", Georgia, serif',
    fontWeight: '600',
  },
  {
    text: 'TIME IS A FLAT CIRCLE',
    reference: 'noir',
    title: 'True Detective',
    href: 'https://www.hbo.com/true-detective',
    color: '#c3ad89',
    font: '"Oswald", sans-serif',
    fontWeight: '500',
  },
  {
    text: 'VALAR MORGHULIS',
    reference: 'thrones',
    title: 'Game of Thrones',
    href: 'https://www.hbo.com/game-of-thrones',
    color: '#acb9c3',
    font: '"Cinzel Decorative", Georgia, serif',
    fontWeight: '700',
  },
];

export const PERSONAL_INFO = {
  name: 'Caner Coskun',
  title: 'Full-Stack Developer & Software Engineering Student',
  university: 'Atilim University',
  graduationYear: 2026,
  location: 'Ankara, Turkey',
  currentRole: 'Full-Stack Developer at Belsis (Active)',
  experience:
    'Developing enterprise municipal reporting platform serving 200+ municipalities nationwide. Experienced in ASP.NET Core, DevExpress, Entity Framework, SQL Server optimization, role-based authorization systems, and Agile/Scrum methodology with Jira.',
  status: 'Full-Stack Developer at Belsis',
  isAvailable: false,
};
