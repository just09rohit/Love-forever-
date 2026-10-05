import React, { useState, useEffect } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Key, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeartKeyPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

export const HeartKeyPage: React.FC<HeartKeyPageProps> = ({ onNext }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [turnDegree, setTurnDegree] = useState(0);

  const handleUnlock = () => {
    if (isUnlocked) return;
    setTurnDegree(90);

    setTimeout(() => {
      soundEngine.playUnlock();
      setIsUnlocked(true);

      confetti({
        particleCount: 45,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#fbcfe8'],
      });

      setTimeout(onNext, 2000);
    }, 450);
  };

  // Auto-unlock sequence after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      handleUnlock();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto select-none space-y-4">
      {/* 3D Heart Lock & Key Stage (Pure Animation, Zero Text) */}
      <div
        onClick={handleUnlock}
        className="relative w-full max-w-lg p-10 rounded-3xl bg-white/75 border-4 border-rose-200/90 backdrop-blur-md neon-card flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <div
          className={`absolute w-72 h-72 rounded-full bg-amber-300/30 blur-3xl transition-opacity duration-1000 ${
            isUnlocked ? 'opacity-100 scale-125' : 'opacity-40'
          }`}
        />

        {!isUnlocked ? (
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Ornate Heart Lock */}
            <div className="relative w-40 h-40 flex items-center justify-center animate-gentle-pulse">
              <div className="absolute -top-8 w-24 h-20 border-[6px] border-amber-400 rounded-t-full -z-10" />

              <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-1.5 neon-btn flex items-center justify-center rotate-45">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-rose-50 to-white flex items-center justify-center -rotate-45">
                  <Lock className="w-16 h-16 text-amber-500 drop-shadow" />
                </div>
              </div>
            </div>

            {/* Turning Golden Key */}
            <div
              className="p-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-900 neon-btn group-hover:scale-110 transition-transform"
              style={{
                transform: `rotate(${turnDegree}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Key className="w-10 h-10 text-stone-950" />
            </div>
          </div>
        ) : (
          /* Unlocked Radiant State */
          <div className="relative z-10 flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-1.5 neon-btn flex items-center justify-center">
              <Unlock className="w-20 h-20 text-white animate-bounce" />
            </div>
            <Sparkles className="w-10 h-10 text-amber-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn mt-4">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "Only you hold the key to my heart 🗝️💖"
        </span>
      </div>
    </div>
  );
};
