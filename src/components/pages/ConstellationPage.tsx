import React, { useEffect, useRef } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConstellationPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

interface StarNode {
  x: number;
  y: number;
  radius: number;
  revealed: boolean;
  noteFreq: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  vx: number;
  vy: number;
  opacity: number;
}

export const ConstellationPage: React.FC<ConstellationPageProps> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const heartStarsRef = useRef<StarNode[]>([
    { x: 50, y: 35, radius: 4, revealed: false, noteFreq: 523.25 },
    { x: 42, y: 24, radius: 4.5, revealed: false, noteFreq: 587.33 },
    { x: 32, y: 22, radius: 5, revealed: false, noteFreq: 659.25 },
    { x: 22, y: 28, radius: 4, revealed: false, noteFreq: 698.46 },
    { x: 18, y: 40, radius: 4.5, revealed: false, noteFreq: 783.99 },
    { x: 22, y: 55, radius: 4, revealed: false, noteFreq: 880.00 },
    { x: 32, y: 70, radius: 5, revealed: false, noteFreq: 987.77 },
    { x: 44, y: 82, radius: 4, revealed: false, noteFreq: 1046.50 },
    { x: 50, y: 88, radius: 6, revealed: false, noteFreq: 1174.66 },
    { x: 56, y: 82, radius: 4, revealed: false, noteFreq: 1046.50 },
    { x: 68, y: 70, radius: 5, revealed: false, noteFreq: 987.77 },
    { x: 78, y: 55, radius: 4, revealed: false, noteFreq: 880.00 },
    { x: 82, y: 40, radius: 4.5, revealed: false, noteFreq: 783.99 },
    { x: 78, y: 28, radius: 4, revealed: false, noteFreq: 698.46 },
    { x: 68, y: 22, radius: 5, revealed: false, noteFreq: 659.25 },
    { x: 58, y: 24, radius: 4.5, revealed: false, noteFreq: 587.33 },
  ]);

  useEffect(() => {
    soundEngine.playCardOpen();

    const stars = heartStarsRef.current;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < stars.length) {
        stars[idx].revealed = true;
        soundEngine.playChime(stars[idx].noteFreq, 0.3, 0.15);
        idx++;
      } else {
        clearInterval(interval);
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#f43f5e', '#fda4af', '#ffffff'],
        });
      }
    }, 280);

    const advanceTimer = setTimeout(onNext, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(advanceTimer);
    };
  }, [onNext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const bgStars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.8,
      speed: 0.02 + Math.random() * 0.04,
    }));

    const shootingStars: ShootingStar[] = [];
    const shootTimer = setInterval(() => {
      if (shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          len: 60 + Math.random() * 60,
          speed: 8 + Math.random() * 6,
          vx: 5 + Math.random() * 3,
          vy: 3 + Math.random() * 2,
          opacity: 1,
        });
      }
    }, 1800);

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Cosmic gradient
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, '#fff5f8');
      grad.addColorStop(0.5, '#fedfe8');
      grad.addColorStop(1, '#fce4ec');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Twinkling stars
      bgStars.forEach((s) => {
        s.opacity += Math.sin(Date.now() * s.speed) * 0.01;
        ctx.fillStyle = `rgba(225, 29, 72, ${Math.max(0.1, Math.min(0.8, s.opacity))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - (ss.vx / ss.speed) * ss.len;
        const tailY = ss.y - (ss.vy / ss.speed) * ss.len;

        const sGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        sGrad.addColorStop(0, 'rgba(244, 63, 94, 0)');
        sGrad.addColorStop(1, `rgba(251, 191, 36, ${ss.opacity})`);

        ctx.strokeStyle = sGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      // Constellation lines
      const stars = heartStarsRef.current;
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        if (!st.revealed) continue;
        const px = (st.x / 100) * width;
        const py = (st.y / 100) * height;

        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }

      if (stars[stars.length - 1].revealed) {
        ctx.lineTo((stars[0].x / 100) * width, (stars[0].y / 100) * height);
      }

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Constellation star nodes
      stars.forEach((st) => {
        if (!st.revealed) return;
        const px = (st.x / 100) * width;
        const py = (st.y / 100) * height;

        ctx.beginPath();
        ctx.arc(px, py, st.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, st.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto select-none space-y-4">
      {/* Constellation Canvas (Pure Animation, Zero Text) */}
      <div
        onClick={onNext}
        className="relative w-full max-w-2xl h-[460px] sm:h-[520px] rounded-3xl p-1 bg-gradient-to-tr from-rose-400 via-pink-300 to-amber-200 neon-card overflow-hidden cursor-pointer"
      >
        <canvas ref={canvasRef} className="w-full h-full rounded-3xl" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-6xl sm:text-7xl animate-pulse drop-shadow-lg">✨💖✨</span>
        </div>
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn mt-4">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "Written in the stars, forever yours 🌟💕"
        </span>
      </div>
    </div>
  );
};
