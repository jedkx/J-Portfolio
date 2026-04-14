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

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  private: boolean;
  default_branch: string;
  pushed_at: string;
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
