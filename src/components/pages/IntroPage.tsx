import React, { useEffect, useState } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { HeartTree } from '../HeartTree';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface IntroPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ config, onNext }) => {
  const [seconds, setSeconds] = useState(6);

  useEffect(() => {
    soundEngine.playCardOpen();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.3 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a'],
    });

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-2 py-4 max-w-4xl mx-auto select-none space-y-3">
      {/* 3D GROWING LOVE TREE */}
      <div className="w-full flex justify-center">
        <HeartTree partnerName={config.partnerName} interactive={true} />
      </div>

      {/* Pure Animated Pulsing Heart Button */}
      <button
        onClick={onNext}
        className="relative group p-4 rounded-full transition-transform hover:scale-110 active:scale-95 cursor-pointer focus-visible:outline-none"
        title="Tap to advance"
      >
        <div className="absolute inset-0 rounded-full bg-rose-400/40 blur-2xl animate-gentle-pulse pointer-events-none" />

        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 border-4 border-white neon-btn flex items-center justify-center animate-gentle-pulse">
          <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-white fill-white drop-shadow-md group-hover:scale-125 transition-transform" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </button>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300/80 neon-badge animate-fadeIn">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "You make my world bloom 🌸"
        </span>
      </div>
    </div>
  );
};
