// ============================================
// DATA CONSTANTS - Portfolio Content
// Caner Coşkun - Software Engineer
// ============================================

import type { Project, Skill, SocialLink, NavItem } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'BELSISNET REPORTING PLATFORM',
    category: 'ENTERPRISE',
    description: 'Enterprise municipal reporting system serving 200+ municipalities across Turkey. Full-stack development with role-based authorization, dynamic report management, version control, and 50% performance optimization through caching mechanisms.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    tags: ['ASP.NET Core', 'DevExpress', 'Entity Framework', 'SQL Server', 'RBAC'],
    link: 'https://belsis.com.tr',
    github: '',
  },
  {
    id: 'project-02',
    title: 'NEWSPAPER PORTFOLIO',
    category: 'WEB_DEV',
    description: 'Vintage newspaper-themed portfolio website built with React 19 and TypeScript. Features 1880s newspaper aesthetics with modern web technologies.',
    imageUrl: 'https://raw.githubusercontent.com/jedkx/Jedkx-NewsPaper-Portfolio/main/src/assets/developer-daily-preview.png',
    tags: ['React 19', 'TypeScript', 'Vite', 'CSS3'],
    link: 'https://jedkx.github.io/Jedkx-NewsPaper-Portfolio/',
    github: 'https://github.com/jedkx/Jedkx-NewsPaper-Portfolio',
  },
  {
    id: 'project-03',
    title: 'PWNAGOTCHI',
    category: 'HARDWARE',
    description: 'AI-powered WiFi security research device using Raspberry Pi Zero W. Deep reinforcement learning for network analysis and security testing with custom OLED interface.',
    imageUrl: 'https://miro.medium.com/v2/resize:fit:720/format:webp/0*ZyM9WnUwk-sXjjha',
    tags: ['Raspberry Pi', 'Python', 'Machine Learning', 'Cybersecurity', 'IoT'],
    link: 'https://medium.com/@ccoskun742/pwnagotchi-setup-a-practical-guide-and-my-advanced-usage-notes-0c698bc07b28',
    github: 'https://github.com/jedkx',
  },
  {
    id: 'project-04',
    title: 'CI/CD FULL-STACK CALCULATOR',
    category: 'ENTERPRISE',
    description: 'Full-stack calculator with comprehensive CI/CD automation pipeline featuring automated testing, deployment, and GitLab integration. Built with .NET 8 backend and React frontend.',
    imageUrl: 'https://delta.blue/img/blog/gitlab-ci-cd.png',
    tags: ['CI/CD Pipeline', '.NET 8', 'React', 'GitLab', 'Automated Testing'],
    link: 'https://gitlab.com/me2815443/my-project',
    github: 'https://gitlab.com/me2815443/my-project',
  },
  {
    id: 'project-05',
    title: 'FORG [IN PROGRESS]',
    category: 'GAME_DEV',
    description: 'An indie game project currently in development using Godot Engine 4.x and GDScript. Features pixel art assets, top-down survival gameplay, player movement, automatic weapons, and enemy AI.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    tags: ['Godot 4.x', 'GDScript', 'Aseprite', 'Game Dev', 'OOP'],
    link: 'https://github.com/jedkx/forg',
    github: 'https://github.com/jedkx/forg',
  },
  {
    id: 'project-06',
    title: 'VIDEO PORTFOLIO',
    category: 'CREATIVE',
    description: 'Modern React-based portfolio showcasing 6+ years of professional video editing work with Ssport+ and NFcomtr. Features responsive design, interactive video galleries, and smooth animations.',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop',
    tags: ['React', 'CSS3', 'Video Production', 'Animation'],
    link: 'https://jedkx.github.io/Jedkx-Video-Editor-Portfolio/',
    github: 'https://github.com/jedkx/Jedkx-Video-Editor-Portfolio',
  },
];

export const SKILLS: Skill[] = [
  // Programming Languages
  { name: 'C', level: 85, category: 'backend' },
  { name: 'C#', level: 88, category: 'backend' },
  { name: 'JavaScript', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Python', level: 80, category: 'backend' },
  { name: 'GDScript', level: 75, category: 'backend' },
  
  // Frameworks
  { name: 'ASP.NET Core', level: 88, category: 'backend' },
  { name: 'MVC', level: 85, category: 'backend' },
  { name: 'Entity Framework', level: 85, category: 'backend' },
  { name: 'React', level: 88, category: 'frontend' },
  { name: 'Bootstrap', level: 88, category: 'frontend' },
  { name: 'Tailwind CSS', level: 90, category: 'frontend' },
  
  // Tools & Methodologies
  { name: 'Git', level: 88, category: 'tools' },
  { name: 'Docker', level: 75, category: 'tools' },
  { name: 'Jira', level: 85, category: 'tools' },
  { name: 'GitLab', level: 82, category: 'tools' },
  { name: 'DevExpress', level: 80, category: 'tools' },
  { name: 'Scrum/Agile', level: 85, category: 'tools' },
  { name: 'SQL Server', level: 82, category: 'backend' },
  
  // Creative
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
];

export const TYPEWRITER_TEXTS = [
  'Full-Stack Developer at Belsis',
  'Software Engineering Student at Atılım',
  'Video Editor with 6+ Years Experience',
  'Cybersecurity & Ethical Hacking Enthusiast',
];

export const CONTACT_EMAIL = 'ccoskun742@gmail.com';

// About Section
export const MANIFESTO_QUOTE = "One Code to rule them all.";

export const MANIFESTO_ITEMS = [
  { 
    text: 'HELLO FRIEND', 
    color: '#ff0000', // Mr. Robot - pure red (fsociety)
    textShadow: '2px 2px 0px #000000, -1px -1px 0px rgba(0,0,0,0.5)',
    font: 'Consolas, "Courier New", monospace',
    fontWeight: '900',
    letterSpacing: '0.3em',
    fontSize: '1em'
  },
  { text: '•', color: '#555555', font: 'inherit' },
  { 
    text: 'SHALL NOT PASS', 
    color: '#9fdc7c', // LOTR - elvish green glow
    textShadow: '2px 2px 0px rgba(0,0,0,0.9), -1px -1px 0px rgba(0,0,0,0.5)',
    font: '"Times New Roman", Georgia, serif',
    fontWeight: '700',
    letterSpacing: '0.2em',
    fontSize: '1em'
  },
  { text: '•', color: '#555555', font: 'inherit' },
  { 
    text: 'TIME IS A FLAT CIRCLE', 
    color: '#ffffff', // True Detective - newspaper noir style (white on black)
    textShadow: '3px 3px 0px #000000, -1px -1px 0px #000000',
    font: '"Century Gothic", "Trebuchet MS", sans-serif',
    fontWeight: '900',
    letterSpacing: '0.08em',
    fontSize: '1em'
  },
  { text: '•', color: '#555555', font: 'inherit' },
  { 
    text: 'VALAR MORGHULIS', 
    color: '#d63031', // GoT - Red God / blood red
    textShadow: '2px 2px 0px #000000, -1px -1px 0px rgba(0,0,0,0.5)',
    font: '"Garamond", "Times New Roman", serif',
    fontWeight: '700',
    letterSpacing: '0.15em',
    fontSize: '1em'
  },
  { text: '•', color: '#555555', font: 'inherit' },
  { 
    text: 'ACCIO SOLUTION', 
    color: '#5899e2', // Harry Potter - Ravenclaw vibrant blue
    textShadow: '2px 2px 0px #000000, -1px -1px 0px rgba(0,0,0,0.5)',
    font: '"Book Antiqua", Palatino, Georgia, serif',
    fontWeight: '700',
    letterSpacing: '0.1em',
    fontSize: '1em'
  },
  { text: '•', color: '#555555', font: 'inherit' },
];

// Personal Info
export const PERSONAL_INFO = {
  name: 'Caner Coşkun',
  title: 'Full-Stack Developer & Software Engineering Student',
  university: 'Atılım University',
  graduationYear: 2026,
  location: 'Ankara, Turkey',
  currentRole: 'Full-Stack Developer at Belsis (Active)',
  experience: 'Developing enterprise municipal reporting platform serving 200+ municipalities nationwide. Experienced in ASP.NET Core, DevExpress, Entity Framework, SQL Server optimization, role-based authorization systems, and Agile/Scrum methodology with Jira.',
  status: 'Full-Stack Developer at Belsis',
  isAvailable: false,
};
