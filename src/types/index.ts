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
}

export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'design';

export interface BootLogItem {
  text: string;
  highlight?: boolean;
  status?: 'success' | 'warning' | 'error';
}

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

export interface ParticleConfig {
  count: number;
  color: string;
  speed: number;
  size: number;
  connectionDistance: number;
}
