import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LoveStoryConfig } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardPageProps {
  config: LoveStoryConfig;
  onNext: () => void;
}

export const ScratchCardPage: React.FC<ScratchCardPageProps> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratchedEnough, setIsScratchedEnough] = useState(false);
  const isDrawing = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f43f5e');
    grad.addColorStop(0.3, '#fb7185');
    grad.addColorStop(0.5, '#ffd1dc');
    grad.addColorStop(0.7, '#f472b6');
    grad.addColorStop(1, '#e11d48');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = -width; i < width * 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💖', width / 2, height / 2);

    setIsScratchedEnough(false);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();

    soundEngine.playScratch();
    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedEnough) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let transparentCount = 0;
    const sampleStep = 32;

    for (let i = 3; i < data.length; i += 4 * sampleStep) {
      if (data[i] === 0) transparentCount++;
    }

    const totalSamples = data.length / (4 * sampleStep);
    const pct = Math.round((transparentCount / totalSamples) * 100);

    if (pct >= 40 && !isScratchedEnough) {
      triggerReveal();
    }
  };

  const triggerReveal = () => {
    setIsScratchedEnough(true);
    soundEngine.playFanfare();

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
    });

    setTimeout(onNext, 2500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isScratchedEnough) {
        triggerReveal();
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isScratchedEnough]);

  return (
    <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto select-none space-y-4">
      {/* Scratch Card Stage */}
      <div className="relative w-[320px] sm:w-[380px] h-[450px] rounded-3xl p-1 bg-gradient-to-tr from-rose-400 via-pink-300 to-amber-200 neon-card overflow-hidden cursor-pointer">
        <div className="absolute inset-1 rounded-3xl bg-gradient-to-b from-white via-rose-50 to-pink-100 p-6 flex flex-col items-center justify-center text-center select-none overflow-hidden">
          <div className="relative flex items-center justify-center animate-gentle-pulse">
            <div className="absolute w-52 h-52 rounded-full bg-rose-400/40 blur-2xl" />
            <Heart className="w-36 h-36 text-rose-500 fill-rose-500 drop-shadow-[0_15px_35px_rgba(244,63,94,0.6)]" />
            <Sparkles className="absolute top-2 right-2 w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '5s' }} />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={380}
          height={450}
          onMouseDown={(e) => {
            isDrawing.current = true;
            scratch(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (!isDrawing.current) return;
            scratch(e.clientX, e.clientY);
          }}
          onMouseUp={() => {
            isDrawing.current = false;
          }}
          onTouchStart={(e) => {
            isDrawing.current = true;
            scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (!isDrawing.current) return;
            scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={() => {
            isDrawing.current = false;
          }}
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
            isScratchedEnough ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      </div>

      {/* Beautiful Simple Word Compliment */}
      <div className="px-6 py-2 rounded-full bg-white/85 backdrop-blur-md border border-rose-300 neon-badge animate-fadeIn">
        <span className="font-cursive text-2xl sm:text-3xl font-bold text-rose-600 tracking-wide">
          "You are my rarest treasure ✨"
        </span>
      </div>
    </div>
  );
};
