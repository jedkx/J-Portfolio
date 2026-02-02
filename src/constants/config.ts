// ============================================
// CONFIGURATION CONSTANTS
// ============================================

export const ANIMATION_CONFIG = {
  loader: {
    bootItemStagger: 0.4,
    bootItemDuration: 0.1,
    loadBarDuration: 1.5,
    fadeOutDuration: 0.5,
  },
  intro: {
    doorDuration: 1.5,
    revealDuration: 1.5,
    revealStagger: 0.2,
  },
  cursor: {
    ringFollowDuration: 0.15,
    ringHoverSize: 60,
    ringHoldSize: 10,
    ringDefaultSize: 40,
  },
  particles: {
    count: 100,
    warpForce: 1200,
    warpDrag: 0.85,
    idleDrag: 0.95,
    driftForce: 0.01,
    connectionDistance: 100,
    color: '#00ff88',
    size: 2,
    speed: 0.5,
  },
  hero: {
    titleDuration: 1.2,
    titleStagger: 0.1,
    subtitleDuration: 0.8,
    ctaDuration: 0.6,
    ctaStagger: 0.15,
  },
  section: {
    fadeInDuration: 0.8,
    slideUpDistance: 60,
    stagger: 0.1,
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const THEME = {
  colors: {
    primary: '#00ff88',
    secondary: '#0affff',
    accent: '#ff00ff',
    background: '#0a0a0f',
    surface: '#12121a',
    surfaceLight: '#1a1a24',
    text: '#ffffff',
    textMuted: '#8a8a9a',
    border: '#2a2a3a',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
  },
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    sans: "'Inter', system-ui, sans-serif",
  },
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
} as const;

export const GSAP_DEFAULTS = {
  ease: 'power3.out',
  duration: 0.8,
} as const;

export type Theme = typeof THEME;
export type AnimationConfigType = typeof ANIMATION_CONFIG;
