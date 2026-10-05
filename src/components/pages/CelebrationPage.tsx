import React, { useEffect } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { FireworksCanvas } from '../FireworksCanvas';
import { HeartTree } from '../HeartTree';
import { RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationPageProps {
  config: LoveStoryConfig;
  onRestart: () => void;
}

export const CelebrationPage: React.FC<CelebrationPageProps> = ({ config, onRestart }) => {
  useEffect(() => {
    soundEngine.playFanfare();

    const end = Date.now() + 4 * 1000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a', '#fda4af'],
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] px-4 py-6 max-w-5xl mx-auto flex flex-col items-center justify-between select-none space-y-4">
      {/* SCREEN-WIDE FIREWORKS PARTICLE CANVAS */}
      <FireworksCanvas />

      {/* Center 3D Love Tree in Full Bloom */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <HeartTree partnerName={config.partnerName} interactive={true} />
      </div>

      {/* Floating Celebratory Symbols */}
      <div className="flex items-center gap-6 text-4xl sm:text-5xl my-2 animate-bounce">
        <span>💍</span>
        <span>💖</span>
        <span>✨</span>
        <span>🌸</span>
        <span>🕊️</span>
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn my-1">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "Forever Mine 💍 You are Rohit's whole universe! 💖"
        </span>
      </div>

      {/* Restart Replay Icon Button */}
      <div className="pt-2">
        <button
          onClick={onRestart}
          className="p-3.5 rounded-full bg-white/95 hover:bg-rose-50 text-rose-700 hover:text-rose-900 border-2 border-rose-300 neon-btn transition-all cursor-pointer active:scale-95"
          title="Replay from Scene 1"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
