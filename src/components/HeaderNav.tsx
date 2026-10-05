import React from 'react';
import { PageStep } from '../types';
import { AudioPlayerControl } from './AudioPlayerControl';

interface HeaderNavProps {
  currentStep: PageStep;
  onNavigate: (step: PageStep) => void;
  partnerName: string;
  onOpenSettings: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStep,
  onNavigate,
}) => {
  const steps: { key: PageStep; icon: string }[] = [
    { key: 'intro', icon: '🌳' },
    { key: 'balloons', icon: '🎈' },
    { key: 'love_letter', icon: '📜' },
    { key: 'scratch', icon: '✨' },
    { key: 'popup_card', icon: '💌' },
    { key: 'heart_key', icon: '🗝️' },
    { key: 'constellation', icon: '⭐' },
    { key: 'proposal', icon: '💍' },
    { key: 'celebration', icon: '🎆' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-rose-200/70 px-3 sm:px-6 py-2 transition-all shadow-xs neon-badge">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Icon */}
        <button
          onClick={() => onNavigate('intro')}
          className="flex items-center gap-1.5 cursor-pointer focus-visible:outline-none group"
        >
          <span className="text-xl sm:text-2xl animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">💖</span>
          <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">
            Forever
          </span>
        </button>

        {/* Scene Navigation Dots / Icons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.key;
            return (
              <button
                key={s.key}
                onClick={() => onNavigate(s.key)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white scale-110 neon-btn ring-2 ring-rose-300'
                    : 'bg-white/80 hover:bg-rose-100 text-rose-800 border border-rose-200/60'
                }`}
                title={`Scene ${idx + 1}`}
              >
                <span>{s.icon}</span>
              </button>
            );
          })}
        </nav>

        {/* Real Audio Controls */}
        <div className="flex items-center gap-2">
          <AudioPlayerControl />
        </div>
      </div>
    </header>
  );
};
