import React, { useEffect, useRef } from 'react';

interface RainingHeart {
  x: number;
  y: number;
  z: number; // depth 0.2 to 1.5
  size: number;
  speed: number;
  swaySpeed: number;
  swayDist: number;
  swayOffset: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  color: string;
  opacity: number;
}

export const HeartRainCanvas: React.FC = () => {
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

    // Romantic palette: soft blush, bright rose, ruby, peach, shimmer gold
    const colors = [
      '#f43f5e', // rose-500
      '#fb7185', // rose-400
      '#fda4af', // rose-300
      '#ec4899', // pink-500
      '#f472b6', // pink-400
      '#fbcfe8', // pink-200
      '#e11d48', // rose-600
      '#fbbf24', // shimmer gold
    ];

    // Hundreds of 3D tumbling hearts (220 particles)
    const HEART_COUNT = 220;
    const hearts: RainingHeart[] = Array.from({ length: HEART_COUNT }, () => {
      const z = 0.25 + Math.random() * 1.1; // depth
      return {
        x: Math.random() * width,
        y: Math.random() * height * 1.5 - height * 0.5,
        z,
        size: (8 + Math.random() * 24) * z,
        speed: (0.4 + Math.random() * 1.1) * z,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDist: 20 + Math.random() * 45,
        swayOffset: Math.random() * Math.PI * 2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.025,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: (0.35 + Math.random() * 0.55) * Math.min(1, z),
      };
    });

    // Helper: Draw single heart shape
    const drawHeart = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      scaleX: number,
      scaleY: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);
      context.scale(scaleX, scaleY);
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = size * 0.4;

      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // top left curve
      context.bezierCurveTo(
        -size / 2, -topCurveHeight * 0.8,
        -size, topCurveHeight * 0.2,
        0, size
      );
      // top right curve
      context.bezierCurveTo(
        size, topCurveHeight * 0.2,
        size / 2, -topCurveHeight * 0.8,
        0, topCurveHeight
      );
      context.closePath();
      context.fill();
      context.restore();
    };

    let tick = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      tick++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];

        // Fall down with gravity
        h.y += h.speed;

        // Gentle horizontal sine-wave breeze
        const sway = Math.sin(tick * h.swaySpeed + h.swayOffset) * h.swayDist;
        const currentX = h.x + sway;

        // 3D rotation tumbling
        h.rotX += h.rotSpeedX;
        h.rotY += h.rotSpeedY;
        h.rotZ += h.rotSpeedZ;

        // Simulate 3D rotation projection via scaleX and scaleY
        const scaleX = Math.cos(h.rotY);
        const scaleY = Math.cos(h.rotX);

        drawHeart(
          ctx,
          currentX,
          h.y,
          h.size,
          scaleX,
          scaleY,
          h.rotZ,
          h.color,
          h.opacity
        );

        // Respawn above screen once fallen past bottom
        if (h.y > height + 40) {
          h.y = -30 - Math.random() * 40;
          h.x = Math.random() * width;
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};
