import React, { useEffect, useRef } from 'react';

interface TrailSpark {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
  rot: number;
}

export const HeartCursorTrail: React.FC = () => {
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

    const sparks: TrailSpark[] = [];
    const colors = ['#f43f5e', '#fb7185', '#ec4899', '#fda4af', '#fbbf24'];

    const addSparks = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        sparks.push({
          x,
          y,
          size: 6 + Math.random() * 8,
          alpha: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: -0.5 - Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      addSparks(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        addSparks(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const drawHeart = (context: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string, alpha: number) => {
      context.save();
      context.translate(cx, cy);
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 6;

      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      context.bezierCurveTo(-size / 2, -topCurveHeight * 0.8, -size, topCurveHeight * 0.2, 0, size);
      context.bezierCurveTo(size, topCurveHeight * 0.2, size / 2, -topCurveHeight * 0.8, 0, topCurveHeight);
      context.closePath();
      context.fill();
      context.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.025;
        s.size *= 0.98;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        drawHeart(ctx, s.x, s.y, s.size, s.color, s.alpha);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
