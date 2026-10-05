import React, { useState, useRef } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProposalPageProps {
  config: LoveStoryConfig;
  onYes: () => void;
}

export const ProposalPage: React.FC<ProposalPageProps> = ({ onYes }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  const playfulMessages = ['🤔', '😜', '😉', '🥰', '💖', '💍 YES!'];

  const handleOpenBox = () => {
    if (!isBoxOpen) {
      soundEngine.playCardOpen();
      setIsBoxOpen(true);
    }
  };

  // Auto-open ring box after 1.5s
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenBox();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNoDodge = () => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    soundEngine.playChime(440 + Math.random() * 200, 0.2);

    if (nextCount >= playfulMessages.length - 1) {
      return;
    }

    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 120;
    setNoBtnPos({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    soundEngine.playFanfare();

    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    onYes();
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto select-none space-y-6">
      {/* 3D LUXURY VELVET RING BOX (Glowing Light Propose Rohit) */}
      <div className="relative w-full max-w-md flex flex-col items-center justify-center perspective-1000">
        <div
          onClick={handleOpenBox}
          className={`relative cursor-pointer transition-transform duration-700 preserve-3d ${
            isBoxOpen ? 'scale-105' : 'hover:scale-[1.03] animate-gentle-pulse'
          }`}
        >
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-56 h-10 bg-rose-950/20 rounded-full blur-xl -z-10" />

          {/* Velvet Box Exterior */}
          <div className="relative w-64 sm:w-72 h-64 sm:h-72 rounded-3xl bg-gradient-to-tr from-[#9f1239] via-[#be123c] to-[#e11d48] p-3 border-4 border-amber-300 neon-card flex flex-col items-center justify-center overflow-hidden">
            {!isBoxOpen ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 neon-btn flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-rose-900 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-amber-300 fill-amber-300 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              /* OPEN BOX: Velvet pillow with 3D diamond solitaire ring */
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute -top-12 w-48 h-48 bg-gradient-to-b from-amber-100/40 via-pink-200/40 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative w-44 h-44 rounded-2xl bg-gradient-to-b from-[#4c0519] to-[#881337] border-2 border-rose-300/60 flex items-center justify-center shadow-inner">
                  {/* Rotating Solitaire Diamond Ring */}
                  <div className="relative flex items-center justify-center animate-float-slow">
                    <div className="w-24 h-24 rounded-full border-8 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#4c0519]" />
                    </div>

                    <div className="absolute -top-4 w-10 h-10 rotate-45 bg-gradient-to-tr from-white via-cyan-100 to-pink-200 shadow-[0_0_25px_rgba(255,255,255,0.9)] border-2 border-white flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-400 animate-spin -rotate-45" style={{ animationDuration: '4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pure Interactive Proposal Actions: Proposing Rohit */}
      {isBoxOpen && (
        <div className="w-full max-w-xl text-center space-y-4 animate-fadeIn">
          {/* Beautiful Simple Word Compliment */}
          <div className="inline-block px-6 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn">
            <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
              "You are my today and all of my tomorrows 💕"
            </span>
          </div>

          {/* Grand Proposal Question */}
          <div className="space-y-1">
            <h1 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 drop-shadow-md">
              Will you be mine? 💍
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-rose-800/90 font-medium">
              Rohit promises to love and cherish you forever
            </p>
          </div>

          <div className="relative min-h-[90px] flex flex-wrap items-center justify-center gap-4 pt-1">
            {/* Glowing YES Button */}
            <button
              onClick={handleYesClick}
              className="relative group px-10 sm:px-14 py-5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xl sm:text-2xl neon-btn hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-3 z-20"
            >
              <Heart className="w-8 h-8 fill-white text-white animate-bounce" />
              <span>YES Rohit! 💍💖</span>
              <Sparkles className="w-6 h-6 text-amber-200 animate-spin" />
            </button>

            {/* Playful Runaway Button */}
            <button
              ref={noBtnRef}
              onClick={noCount >= playfulMessages.length - 1 ? handleYesClick : handleNoDodge}
              onMouseEnter={noCount < playfulMessages.length - 1 ? handleNoDodge : undefined}
              onTouchStart={noCount < playfulMessages.length - 1 ? handleNoDodge : undefined}
              style={{
                transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`,
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`px-6 py-4 rounded-2xl border-2 text-base font-bold transition-colors cursor-pointer select-none ${
                noCount >= playfulMessages.length - 1
                  ? 'bg-rose-500 text-white border-rose-600 neon-btn animate-pulse'
                  : 'bg-white text-rose-700 hover:text-rose-900 border-rose-300 hover:bg-rose-50 neon-badge'
              }`}
            >
              {playfulMessages[Math.min(noCount, playfulMessages.length - 1)]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
