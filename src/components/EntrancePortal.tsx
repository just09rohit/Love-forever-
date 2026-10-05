import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { realMusicEngine, REAL_TRACKS } from '../utils/realAudio';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EntrancePortalProps {
  onEnter: () => void;
}

export const EntrancePortal: React.FC<EntrancePortalProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleEnter = () => {
    setIsOpening(true);

    // Initialize audio context and ensure South Movie Hello violin theme plays continuously
    soundEngine.initCtx();
    soundEngine.setTune('hello_violin_theme');
    soundEngine.startMusic();
    realMusicEngine.playTrack(REAL_TRACKS[0]);
    soundEngine.playFanfare();

    // Celebratory heart burst
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
    });

    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#fff0f5] via-[#ffe4e9] to-[#fedfe8] select-none transition-all duration-1000 ${
        isOpening ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'
      }`}
    >
      {/* Radiant Background Aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-400/30 via-pink-300/40 to-amber-200/40 blur-3xl animate-gentle-pulse pointer-events-none" />

      {/* Floating Sparkles & Rings */}
      <div className="relative flex flex-col items-center justify-center text-center space-y-6">
        {/* Giant Glowing Beating Heart Portal */}
        <button
          onClick={handleEnter}
          className="group relative p-8 rounded-full transition-transform hover:scale-110 active:scale-95 cursor-pointer focus-visible:outline-none"
        >
          {/* Pulsating Glowing Ring Halos */}
          <div className="absolute inset-0 rounded-full border-4 border-rose-400/40 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-4 rounded-full border-2 border-pink-400/30 animate-pulse" />

          {/* Core Jewel Heart */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 p-1.5 neon-btn flex items-center justify-center border-4 border-white animate-gentle-pulse">
            <Heart className="w-20 h-20 sm:w-24 sm:h-24 text-white fill-white drop-shadow-lg group-hover:scale-125 transition-transform" />
            <Sparkles className="absolute top-2 right-2 w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </button>

        {/* Romantic Proposal Emblem */}
        <div className="space-y-1">
          <div className="font-cursive text-4xl sm:text-5xl font-bold text-rose-600 drop-shadow-xs">
            From Rohit, With All My Heart
          </div>
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-rose-800/80 block pt-1">
            Tap Heart to Begin Our Journey 💖
          </span>
        </div>
      </div>
    </div>
  );
};
