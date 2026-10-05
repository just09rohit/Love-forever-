import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  friction: number;
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  isHeart: boolean;
}

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const fireworkColors = [
      '#f43f5e', // Rose
      '#fb7185', // Soft Rose
      '#ec4899', // Pink
      '#f472b6', // Light Pink
      '#fbbf24', // Gold
      '#fef08a', // Pale Gold
      '#ffffff', // Diamond White
      '#e11d48', // Ruby
      '#c084fc', // Lavender
    ];

    // Explode a rocket into particles (with heart shape support)
    const explode = (x: number, y: number, color: string, isHeart: boolean) => {
      soundEngine.playChime(523.25 + Math.random() * 400, 0.4, 0.15);

      if (isHeart) {
        // Heart-shaped mathematical parametric firework
        const count = 90;
        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 2;
          // Parametric heart formula
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

          const speed = 0.28 + Math.random() * 0.08;
          particles.push({
            x,
            y,
            vx: hx * speed,
            vy: hy * speed,
            color,
            alpha: 1,
            decay: 0.009 + Math.random() * 0.008,
            size: 2.5 + Math.random() * 2,
            gravity: 0.04,
            friction: 0.985,
            flicker: Math.random() > 0.4,
          });
        }
      } else {
        // Spherical chrysanthemum burst
        const count = 80;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            decay: 0.012 + Math.random() * 0.01,
            size: 2 + Math.random() * 2.5,
            gravity: 0.06,
            friction: 0.98,
            flicker: Math.random() > 0.5,
          });
        }
      }
    };

    // Launch rocket
    const launchRocket = (x?: number, targetY?: number) => {
      const startX = x !== undefined ? x : 0.15 * width + Math.random() * 0.7 * width;
      const destY = targetY !== undefined ? targetY : 0.15 * height + Math.random() * 0.4 * height;
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      const isHeart = Math.random() > 0.35; // 65% heart fireworks!

      rockets.push({
        x: startX,
        y: height,
        targetY: destY,
        vy: -9 - Math.random() * 4,
        color,
        isHeart,
      });
    };

    // Initial barrage
    for (let i = 0; i < 4; i++) {
      setTimeout(() => launchRocket(), i * 350);
    }

    // Auto-launch intervals
    let launchTimer = setInterval(() => {
      if (rockets.length < 5) {
        launchRocket();
      }
    }, 900);

    // Interactive click: spawn firework at cursor
    const handleCanvasClick = (e: MouseEvent) => {
      explode(
        e.clientX,
        e.clientY,
        fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
        true
      );
    };
    window.addEventListener('click', handleCanvasClick);

    // Render loop
    const render = () => {
      animId = requestAnimationFrame(render);

      // Semi-transparent clear for light trails
      ctx.clearRect(0, 0, width, height);

      // Update & render rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        // Draw rocket head & glowing trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Sparkle tail
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 12);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color, r.isHeart);
          rockets.splice(i, 1);
        }
      }

      // Update & render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.flicker && Math.random() > 0.5 ? p.alpha * 0.6 : p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(launchTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
