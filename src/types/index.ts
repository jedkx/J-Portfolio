// ============================================
// TYPE DEFINITIONS - Portfolio Application
// ============================================

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link: string;
  github?: string;
  source?: 'static' | 'github';
  updatedAt?: string;
}


export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'design';

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export interface Coordinates {
  lat: string;
  lng: string;
  alt: string;
  status: 'nominal' | 'warning' | 'critical';
}

export interface TerminalLine {
  text: string;
  delay: number;
  type: 'normal' | 'success' | 'error' | 'warning';
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  location: string;
  note?: string;
}
