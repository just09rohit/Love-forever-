import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Wind } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeartLeaf {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
  delay: number; // seconds
  swaySpeed: number;
  rotation: number;
}

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  drift: number;
  opacity: number;
}

interface HeartTreeProps {
  partnerName: string;
  interactive?: boolean;
}

export const HeartTree: React.FC<HeartTreeProps> = ({ partnerName, interactive = true }) => {
  const [leaves, setLeaves] = useState<HeartLeaf[]>([]);
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);
  const [blossomedCount, setBlossomedCount] = useState(0);
  const nextId = useRef(100);

  // Generate artistic distribution of heart leaves on branch canopy
  useEffect(() => {
    const heartColors = [
      '#f43f5e', // rose-500
      '#fb7185', // rose-400
      '#ec4899', // pink-500
      '#f472b6', // pink-400
      '#fda4af', // rose-300
      '#fbcfe8', // pink-200
      '#e11d48', // rose-600
      '#be185d', // pink-700
    ];

    // Branch nodes geometry (percentages within the canopy viewBox)
    const branchCanopyPoints = [
      // Left major branch
      { x: 32, y: 38 }, { x: 28, y: 34 }, { x: 24, y: 30 }, { x: 20, y: 26 }, { x: 16, y: 22 },
      { x: 22, y: 18 }, { x: 26, y: 15 }, { x: 30, y: 22 }, { x: 34, y: 26 }, { x: 36, y: 18 },
      { x: 18, y: 32 }, { x: 14, y: 28 }, { x: 12, y: 34 }, { x: 22, y: 38 },
      // Center top high canopy
      { x: 48, y: 22 }, { x: 50, y: 16 }, { x: 52, y: 12 }, { x: 44, y: 14 }, { x: 56, y: 15 },
      { x: 46, y: 10 }, { x: 54, y: 9 }, { x: 40, y: 18 }, { x: 60, y: 18 }, { x: 50, y: 8 },
      // Right major branch
      { x: 68, y: 38 }, { x: 72, y: 34 }, { x: 76, y: 30 }, { x: 80, y: 26 }, { x: 84, y: 22 },
      { x: 78, y: 18 }, { x: 74, y: 15 }, { x: 70, y: 22 }, { x: 66, y: 26 }, { x: 64, y: 18 },
      { x: 82, y: 32 }, { x: 86, y: 28 }, { x: 88, y: 34 }, { x: 78, y: 38 },
      // Mid canopy lush clusters
      { x: 42, y: 28 }, { x: 58, y: 28 }, { x: 38, y: 32 }, { x: 62, y: 32 }, { x: 46, y: 32 },
      { x: 54, y: 32 }, { x: 48, y: 36 }, { x: 52, y: 36 }, { x: 36, y: 36 }, { x: 64, y: 36 },
      // Outer peripheral blossoms
      { x: 10, y: 24 }, { x: 90, y: 24 }, { x: 8, y: 30 }, { x: 92, y: 30 }, { x: 28, y: 12 },
      { x: 72, y: 12 }, { x: 38, y: 10 }, { x: 62, y: 10 }, { x: 44, y: 6 }, { x: 56, y: 6 },
    ];

    const initialLeaves: HeartLeaf[] = branchCanopyPoints.map((pt, i) => {
      // Natural scatter
      const scatterX = pt.x + (Math.random() - 0.5) * 5;
      const scatterY = pt.y + (Math.random() - 0.5) * 4;
      return {
        id: i,
        x: scatterX,
        y: scatterY,
        size: 16 + Math.random() * 14,
        color: heartColors[i % heartColors.length],
        delay: 0.1 + (i * 0.04), // staggered growing blossom
        swaySpeed: 2.5 + Math.random() * 2,
        rotation: (Math.random() - 0.5) * 35,
      };
    });

    setLeaves(initialLeaves);
    setBlossomedCount(initialLeaves.length);
  }, []);

  // Falling heart petals animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setFallingHearts((prev) => {
        // Add new falling heart periodically
        const next = prev
          .map((h) => ({
            ...h,
            y: h.y + h.speed,
            x: h.x + Math.sin(h.y * 0.08) * h.drift,
            opacity: h.y > 85 ? Math.max(0, (100 - h.y) / 15) : h.opacity,
          }))
          .filter((h) => h.y < 100);

        if (Math.random() < 0.45 && next.length < 18) {
          const colors = ['#fb7185', '#f43f5e', '#fda4af', '#f472b6', '#e11d48'];
          next.push({
            id: Date.now() + Math.random(),
            x: 20 + Math.random() * 60,
            y: 15 + Math.random() * 25,
            size: 10 + Math.random() * 10,
            speed: 0.4 + Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            drift: 0.4 + Math.random() * 0.4,
            opacity: 0.9,
          });
        }
        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Sprout more hearts on click
  const handleTreeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    soundEngine.playChime(659.25 + Math.random() * 300, 0.35);

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    const colors = ['#f43f5e', '#fb7185', '#ec4899', '#fda4af', '#e11d48'];
    const newLeaf: HeartLeaf = {
      id: nextId.current++,
      x: Math.max(10, Math.min(90, xPct)),
      y: Math.max(8, Math.min(65, yPct)),
      size: 20 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: 0,
      swaySpeed: 2.5,
      rotation: (Math.random() - 0.5) * 40,
    };

    setLeaves((prev) => [...prev, newLeaf]);
    setBlossomedCount((c) => c + 1);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none my-1">
      {/* Main 3D Canvas / SVG Container (Pure Animation, Zero Text) */}
      <div
        onClick={handleTreeClick}
        className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] rounded-3xl bg-gradient-to-b from-[#fff5f8]/95 via-[#fedfe8]/85 to-[#fce4ec]/95 border-2 border-rose-300/40 shadow-[0_20px_60px_rgba(244,63,94,0.18)] overflow-hidden cursor-pointer group"
      >
        {/* Soft glowing sun aura behind tree */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-pink-200/50 via-rose-200/40 to-amber-100/60 blur-3xl pointer-events-none" />

        {/* Tree Trunk & Branches SVG Illustration */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4a1525" />
              <stop offset="40%" stopColor="#6e203c" />
              <stop offset="75%" stopColor="#88284c" />
              <stop offset="100%" stopColor="#a3325c" />
            </linearGradient>
            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Root Mound */}
          <path
            d="M 50 390 Q 200 360 350 390 L 350 400 L 50 400 Z"
            fill="url(#grassGrad)"
          />

          {/* Root flare */}
          <path
            d="M 170 380 Q 150 395 120 395 Q 175 385 185 365"
            stroke="url(#trunkGrad)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 230 380 Q 255 395 285 395 Q 235 385 220 365"
            stroke="url(#trunkGrad)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />

          {/* Main Solid Trunk */}
          <path
            d="M 180 385 C 185 320, 175 250, 192 190 C 196 170, 204 170, 208 190 C 225 250, 215 320, 220 385 Z"
            fill="url(#trunkGrad)"
          />

          {/* Left Major Curved Branch */}
          <path
            d="M 192 230 Q 150 200 120 150 Q 100 120 80 110"
            stroke="url(#trunkGrad)"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 135 170 Q 110 145 90 90"
            stroke="url(#trunkGrad)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 155 190 Q 165 140 140 95"
            stroke="url(#trunkGrad)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* Center High Branch */}
          <path
            d="M 200 195 Q 195 130 200 70"
            stroke="url(#trunkGrad)"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 198 140 Q 175 100 170 60"
            stroke="url(#trunkGrad)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 200 130 Q 225 95 230 55"
            stroke="url(#trunkGrad)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right Major Curved Branch */}
          <path
            d="M 208 230 Q 250 200 280 150 Q 300 120 320 110"
            stroke="url(#trunkGrad)"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 265 170 Q 290 145 310 90"
            stroke="url(#trunkGrad)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 245 190 Q 235 140 260 95"
            stroke="url(#trunkGrad)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* 3D Blossomed Heart Leaves */}
        <div className="absolute inset-0 pointer-events-none">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-150 animate-blossom"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                animationDelay: `${leaf.delay}s`,
              }}
            >
              <div
                style={{
                  animation: `floatSlow ${leaf.swaySpeed}s ease-in-out infinite alternate`,
                  transform: `rotate(${leaf.rotation}deg)`,
                }}
              >
                <Heart
                  style={{
                    width: `${leaf.size}px`,
                    height: `${leaf.size}px`,
                    color: leaf.color,
                    fill: leaf.color,
                    filter: `drop-shadow(0 2px 8px ${leaf.color}88)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Falling Heart Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fallingHearts.map((h) => (
            <div
              key={h.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                opacity: h.opacity,
                transition: 'top 0.05s linear, left 0.05s linear',
              }}
            >
              <Heart
                style={{
                  width: `${h.size}px`,
                  height: `${h.size}px`,
                  color: h.color,
                  fill: h.color,
                  transform: `rotate(${h.y * 3}deg)`,
                  filter: `drop-shadow(0 1px 4px ${h.color}66)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
