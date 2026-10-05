import React, { useState, useEffect } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PopUpCardPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

export const PopUpCardPage: React.FC<PopUpCardPageProps> = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto-open card after 800ms
    const openTimer = setTimeout(() => {
      soundEngine.playCardOpen();
      setIsOpen(true);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#fda4af', '#f43f5e', '#fbcfe8'],
      });
    }, 800);

    // Auto-advance after 6s
    const advanceTimer = setTimeout(onNext, 6000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(advanceTimer);
    };
  }, [onNext]);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto select-none space-y-4">
      {/* 3D POP-UP CARD (Pure Animation, Zero Text) */}
      <div className="w-full max-w-xl h-[460px] sm:h-[500px] perspective-1500 cursor-pointer" onClick={onNext}>
        <div
          className={`relative w-full h-full transition-transform duration-1000 preserve-3d ${
            isOpen ? 'rotate-y-0' : 'hover:scale-[1.02]'
          }`}
        >
          {/* CLOSED STATE */}
          {!isOpen ? (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white via-pink-50 to-rose-100 border-4 border-rose-300 neon-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 p-[3px] neon-btn flex items-center justify-center animate-gentle-pulse">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
                </div>
              </div>
            </div>
          ) : (
            /* OPEN 3D POP-UP STATE: Layers of Blooming 3D Hearts & Paper Flowers */
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white via-rose-50 to-pink-100/90 border-4 border-rose-300 neon-card flex items-center justify-center overflow-hidden animate-in fade-in zoom-in-95 duration-700">
              {/* Radial glow */}
              <div className="absolute w-72 h-72 rounded-full bg-rose-400/30 blur-3xl pointer-events-none" />

              {/* 3D Papercraft Pop-Up Assembly */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Pop-up blooming heart bouquet */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center animate-gentle-pulse">
                  <Heart className="w-40 h-40 sm:w-48 sm:h-48 text-rose-500 fill-rose-500 drop-shadow-[0_15px_35px_rgba(244,63,94,0.5)]" />
                  <Sparkles className="absolute -top-3 -right-3 w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />

                  {/* Fluttering butterflies/flowers */}
                  <span className="absolute -left-6 top-8 text-3xl animate-bounce" style={{ animationDuration: '2s' }}>🦋</span>
                  <span className="absolute -right-6 top-8 text-3xl animate-bounce" style={{ animationDuration: '2.5s' }}>🌸</span>
                  <span className="absolute -left-2 bottom-4 text-3xl animate-bounce" style={{ animationDuration: '3s' }}>✨</span>
                  <span className="absolute -right-2 bottom-4 text-3xl animate-bounce" style={{ animationDuration: '2.2s' }}>💖</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn mt-4">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "Every second with you is pure magic ✨"
        </span>
      </div>
    </div>
  );
};
