import React, { useState, useEffect } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BalloonPopPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

interface PureBalloon {
  id: number;
  color: string;
  heartIcon: string;
  popped: boolean;
  size: number;
  x: number;
  speed: number;
}

export const BalloonPopPage: React.FC<BalloonPopPageProps> = ({ onNext }) => {
  const [balloons, setBalloons] = useState<PureBalloon[]>([
    { id: 1, color: 'from-rose-500 via-pink-400 to-rose-600', heartIcon: '💖', popped: false, size: 140, x: 15, speed: 3.2 },
    { id: 2, color: 'from-pink-400 via-rose-300 to-pink-600', heartIcon: '💘', popped: false, size: 155, x: 38, speed: 4.0 },
    { id: 3, color: 'from-fuchsia-400 via-pink-400 to-rose-500', heartIcon: '💕', popped: false, size: 145, x: 62, speed: 3.5 },
    { id: 4, color: 'from-amber-300 via-rose-400 to-pink-500', heartIcon: '❤️', popped: false, size: 160, x: 85, speed: 3.8 },
  ]);

  const popBalloon = (id: number, e?: React.MouseEvent) => {
    soundEngine.playPop();

    let x = 0.5, y = 0.5;
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x, y },
      colors: ['#f43f5e', '#fb7185', '#ec4899', '#fef08a'],
    });

    setBalloons((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, popped: true } : b));
      if (next.every((b) => b.popped)) {
        setTimeout(onNext, 1800);
      }
      return next;
    });
  };

  useEffect(() => {
    const timers = balloons.map((b, idx) => {
      return setTimeout(() => {
        setBalloons((current) => {
          if (!current[idx].popped) {
            soundEngine.playPop();
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { x: (current[idx].x / 100), y: 0.5 },
              colors: ['#f43f5e', '#fb7185', '#ec4899'],
            });
            const updated = current.map((item, i) =>
              i === idx ? { ...item, popped: true } : item
            );
            if (updated.every((item) => item.popped)) {
              setTimeout(onNext, 1800);
            }
            return updated;
          }
          return current;
        });
      }, 1500 + idx * 1200);
    });

    return () => timers.forEach(clearTimeout);
  }, [onNext]);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto select-none space-y-4">
      {/* Floating 3D Glossy Balloons Arena */}
      <div className="relative w-full h-[460px] rounded-3xl bg-white/75 border-2 border-rose-200/90 backdrop-blur-md p-6 neon-card flex items-center justify-around overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-pink-200/40 via-rose-200/30 to-amber-100/50 blur-3xl pointer-events-none" />

        {balloons.map((b) => (
          <div
            key={b.id}
            className="relative flex flex-col items-center"
            style={{
              animation: !b.popped
                ? `floatSlow ${b.speed}s ease-in-out infinite alternate`
                : undefined,
            }}
          >
            {!b.popped ? (
              <button
                onClick={(e) => popBalloon(b.id, e)}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-115 active:scale-95 focus-visible:outline-none"
              >
                <div
                  className={`relative rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] bg-gradient-to-tr ${b.color} shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.18),0_0_25px_rgba(244,63,94,0.45)] flex items-center justify-center border-t border-white/70 transition-transform group-hover:rotate-6`}
                  style={{
                    width: `${b.size}px`,
                    height: `${b.size * 1.25}px`,
                  }}
                >
                  <div className="absolute top-3 left-4 w-8 h-14 bg-white/60 rounded-full blur-[2px] -rotate-45 pointer-events-none" />
                  <span className="text-4xl sm:text-5xl drop-shadow-md group-hover:scale-125 transition-transform">
                    {b.heartIcon}
                  </span>
                  <div className="absolute -bottom-2.5 w-4 h-3.5 bg-rose-600 rounded-sm" />
                </div>
                <div className="w-[2px] h-24 bg-gradient-to-b from-rose-400 via-rose-300/60 to-transparent mt-1" />
              </button>
            ) : (
              <div className="w-20 h-20 rounded-full bg-rose-100/80 border-2 border-rose-300 flex items-center justify-center neon-btn animate-blossom">
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "Your laugh is my favorite melody 🎶"
        </span>
      </div>
    </div>
  );
};
