import React, { useEffect, useState } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalLoveLetterProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

export const DigitalLoveLetterPage: React.FC<DigitalLoveLetterProps> = ({ onNext }) => {
  const [seconds, setSeconds] = useState(6);

  useEffect(() => {
    soundEngine.playCardOpen();
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.4 },
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
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto select-none space-y-4">
      {/* Scrollable Royal Parchment Container */}
      <div
        onClick={onNext}
        className="relative w-full max-w-lg h-[460px] sm:h-[500px] rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#fffafc] via-[#fff0f5] to-[#fce4ec] border-4 border-rose-300 neon-card flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <div className="absolute top-4 inset-x-8 flex items-center justify-between border-b-2 border-rose-200/80 pb-2">
          <span className="text-2xl text-rose-500">❦</span>
          <span className="text-xl">🕊️</span>
          <span className="text-2xl text-rose-500">❦</span>
        </div>

        {/* GIANT 3D BEATING CRYSTAL HEART */}
        <div className="relative my-auto flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-rose-400/40 via-pink-300/50 to-amber-200/40 blur-3xl animate-gentle-pulse pointer-events-none" />

          <div className="absolute inset-0 w-60 h-60 animate-spin" style={{ animationDuration: '10s' }}>
            <Heart className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-md" />
            <Heart className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 text-rose-400 fill-rose-400 drop-shadow-md" />
            <Heart className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-md" />
            <Heart className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-rose-600 fill-rose-600 drop-shadow-md" />
          </div>

          <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center animate-gentle-pulse transition-transform group-hover:scale-115">
            <Heart
              className="w-40 h-40 sm:w-48 sm:h-48 text-rose-500 fill-rose-500 drop-shadow-[0_20px_45px_rgba(225,29,72,0.6)]"
            />
            <Sparkles className="absolute w-12 h-12 text-white animate-spin drop-shadow" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div className="absolute bottom-4 inset-x-8 flex items-center justify-between border-t-2 border-rose-200/80 pt-2">
          <span className="text-2xl text-rose-500">❦</span>
          <span className="text-xl">🌸</span>
          <span className="text-2xl text-rose-500">❦</span>
        </div>
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "My heart beats only for you 💖"
        </span>
      </div>
    </div>
  );
};
