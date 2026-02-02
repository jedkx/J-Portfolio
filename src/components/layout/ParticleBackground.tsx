// ============================================
// PARTICLE BACKGROUND - LIVING STARS
// Hold to attract, release to explode
// Stars are born and die
// ============================================

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  dying: boolean;
}

interface MouseState {
  x: number;
  y: number;
  holding: boolean;
  wasHolding: boolean;
  holdStartTime: number;
  chargeLevel: number;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({
    x: -1000,
    y: -1000,
    holding: false,
    wasHolding: false,
    holdStartTime: 0,
    chargeLevel: 0,
  });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MAX_PARTICLES = 80;
    const MAX_CHARGE_TIME = 10; // seconds

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create a new star
    const birthStar = (x?: number, y?: number): Particle => {
      const maxLife = Math.random() * 5000 + 3000;
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        maxOpacity: Math.random() * 0.7 + 0.3,
        life: 0,
        maxLife,
        dying: false,
      };
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => {
        const p = birthStar();
        p.life = Math.random() * p.maxLife;
        p.opacity = p.maxOpacity * Math.min(1, p.life / 50);
        return p;
      });
    };

    const drawParticle = (particle: Particle) => {
      if (particle.opacity <= 0) return;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
    };

    const drawConnections = () => {
      // Only draw connections to mouse when holding (skip expensive particle-to-particle)
      const mouse = mouseRef.current;
      if (!mouse.holding) return;

      const charge = mouse.chargeLevel;
      const connectionRange = 250 + charge * 100;
      const particles = particlesRef.current;

      ctx.beginPath();
      particles.forEach((p) => {
        if (p.opacity < 0.2) return;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const rangeSq = connectionRange * connectionRange;

        if (distSq < rangeSq) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
        }
      });

      const r = 255;
      const g = Math.floor(100 + charge * 155);
      const b = Math.floor(100 + charge * 155);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 + charge * 0.3})`;
      ctx.lineWidth = 0.5 + charge * 1;
      ctx.stroke();
    };

    const drawAttractionGlow = () => {
      const mouse = mouseRef.current;
      if (!mouse.holding) return;

      const charge = mouse.chargeLevel;
      const glowSize = 80 + charge * 220;

      // Outer glow
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, glowSize
      );
      const r = 255;
      const g = Math.floor(100 + charge * 155);
      const b = Math.floor(50 + charge * 205);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.3 + charge * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g * 0.5}, ${b * 0.5}, ${0.1 + charge * 0.2})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner core pulse
      if (charge > 0.1) {
        const pulseSize = 10 + charge * 20 + Math.sin(Date.now() * 0.02) * 8 * charge;
        const coreGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, pulseSize
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${charge * 0.8})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
      }
    };

    const updateParticles = () => {
      const mouse = mouseRef.current;
      const { x: mx, y: my, holding, wasHolding, holdStartTime } = mouse;

      // Calculate charge level (0 to 1 over MAX_CHARGE_TIME seconds)
      if (holding && holdStartTime > 0) {
        const holdDuration = (Date.now() - holdStartTime) / 1000;
        mouse.chargeLevel = Math.min(1, holdDuration / MAX_CHARGE_TIME);
      }

      // Check for explosion on release
      const justReleased = wasHolding && !holding;
      const releaseChargeLevel = justReleased ? mouse.chargeLevel : 0;

      if (justReleased) {
        mouse.wasHolding = false;
        mouse.chargeLevel = 0;
        mouse.holdStartTime = 0;
      }

      const chargeLevel = mouse.chargeLevel;

      particlesRef.current.forEach((particle) => {
        // Life cycle
        particle.life++;

        // Birth: fade in
        if (particle.life < 100) {
          particle.opacity = (particle.life / 100) * particle.maxOpacity;
        }
        // Death: fade out at 85% of life
        else if (particle.life > particle.maxLife * 0.85) {
          particle.dying = true;
          const deathProgress = (particle.life - particle.maxLife * 0.85) / (particle.maxLife * 0.15);
          particle.opacity = particle.maxOpacity * (1 - deathProgress);
        }
        // Normal life with twinkle
        else if (!particle.dying) {
          particle.opacity = particle.maxOpacity + Math.sin(particle.life * 0.05) * 0.1;
        }

        // Rebirth when dead
        if (particle.life >= particle.maxLife || particle.opacity <= 0) {
          const newStar = birthStar();
          Object.assign(particle, newStar);
        }

        // Movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction - use squared distance for performance
        const dx = mx - particle.x;
        const dy = my - particle.y;
        const distSq = dx * dx + dy * dy;

        // Attraction when holding
        if (holding && distSq < 160000 && distSq > 0) { // 400^2
          const distance = Math.sqrt(distSq);
          const baseForce = 0.3 + chargeLevel * 0.7;
          const force = ((400 - distance) / 400) * baseForce;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;

          // Trembling effect
          const trembleStrength = chargeLevel * 1.5;
          particle.vx += (Math.random() - 0.5) * trembleStrength;
          particle.vy += (Math.random() - 0.5) * trembleStrength;

          // Brighten when pulled
          particle.opacity = Math.min(1, particle.maxOpacity + (1 - distance / 400) * (0.3 + chargeLevel * 0.3));
        }
        // Explosion on release - only nearby particles
        else if (justReleased) {
          const explosionRange = 350 + releaseChargeLevel * 250;
          const explosionRangeSq = explosionRange * explosionRange;
          if (distSq < explosionRangeSq && distSq > 0) {
            const distance = Math.sqrt(distSq);
            const chargeMultiplier = 1 + Math.pow(releaseChargeLevel, 1.5) * 12;
            const explosionPower = 18 * chargeMultiplier;
            const distanceFactor = Math.pow(1 - distance / explosionRange, 1.8);
            const force = distanceFactor * explosionPower;
            particle.vx -= (dx / distance) * force;
            particle.vy -= (dy / distance) * force;
          }
        }

        // Speed limit
        const maxSpeed = justReleased ? 30 + releaseChargeLevel * 45 : 3;
        const speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
        if (speedSq > maxSpeed * maxSpeed) {
          const speed = Math.sqrt(speedSq);
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Gentle random drift
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;

        // Wrap around edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateParticles();
      drawConnections();
      particlesRef.current.forEach(drawParticle);
      drawAttractionGlow();

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Only activate if mouse is within canvas bounds
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouseRef.current.holding = true;
        mouseRef.current.wasHolding = true;
        mouseRef.current.holdStartTime = Date.now();
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.holding = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.holding = false;
    };

    // Initialize
    resize();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  );
};
