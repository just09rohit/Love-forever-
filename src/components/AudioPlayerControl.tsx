import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export const AudioPlayerControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendIframeCommand = (func: string, args: unknown = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {
      // Ignore cross-origin postMessage errors if any
    }
  };

  useEffect(() => {
    // Start South Movie Hello Violin tune on first user gesture
    const startOnGesture = () => {
      soundEngine.initCtx();
      soundEngine.setTune('hello_violin_theme');
      soundEngine.startMusic();
      setIsPlaying(true);
      sendIframeCommand('unMute');
      sendIframeCommand('playVideo');
      sendIframeCommand('seekTo', [45, true]);

      window.removeEventListener('click', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
      window.removeEventListener('touchstart', startOnGesture);
    };

    window.addEventListener('click', startOnGesture, { once: true });
    window.addEventListener('keydown', startOnGesture, { once: true });
    window.addEventListener('touchstart', startOnGesture, { once: true });

    // Loop the middle part of the YouTube video every 65 seconds
    const loopInterval = setInterval(() => {
      if (isPlaying && !isMuted) {
        sendIframeCommand('seekTo', [45, true]);
      }
    }, 65000);

    return () => {
      clearInterval(loopInterval);
      window.removeEventListener('click', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
      window.removeEventListener('touchstart', startOnGesture);
    };
  }, [isPlaying, isMuted]);

  const handleToggle = () => {
    if (isPlaying) {
      soundEngine.stopMusic();
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      soundEngine.initCtx();
      soundEngine.startMusic();
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (muted) {
      sendIframeCommand('mute');
    } else {
      sendIframeCommand('unMute');
    }
  };

  return (
    <div className="relative flex items-center gap-1.5 sm:gap-2">
      {/* Hidden YouTube Audio Player for: https://youtu.be/gyagxPoll2k (Hello Violin Tune - Middle Part) */}
      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/gyagxPoll2k?autoplay=1&mute=0&controls=0&loop=1&playlist=gyagxPoll2k&start=45&enablejsapi=1"
        allow="autoplay; encrypted-media"
        title="South Movie Hello Violin Tune"
        className="w-0 h-0 opacity-0 pointer-events-none fixed -bottom-10 -right-10"
      />

      {/* Main Track Display Pill with subtle neon glow */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100 text-rose-900 border border-rose-300 shadow-xs neon-badge"
        title="South Movie 'Hello' (Taqdeer) Violin Theme - Anup Rubens"
      >
        {isPlaying && !isMuted ? (
          <div className="flex items-end gap-[2px] h-3.5 w-3 mr-0.5">
            <span className="w-[2px] bg-rose-500 animate-pulse h-full" style={{ animationDuration: '0.5s' }} />
            <span className="w-[2px] bg-pink-500 animate-pulse h-2/3" style={{ animationDuration: '0.8s' }} />
            <span className="w-[2px] bg-amber-500 animate-pulse h-4/5" style={{ animationDuration: '0.4s' }} />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-rose-400" />
        )}

        <div className="flex flex-col">
          <span className="truncate max-w-[130px] sm:max-w-[170px] text-rose-900 font-bold text-[11px] leading-tight">
            Hello · Violin Romance 🎻
          </span>
          <span className="hidden sm:inline text-[9px] text-rose-600 font-medium leading-none">
            South Movie (Middle Part)
          </span>
        </div>
      </div>

      {/* Play/Pause Button with neon glow */}
      <button
        onClick={handleToggle}
        className="p-1.5 sm:p-2 rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-700 neon-btn cursor-pointer"
        title={isPlaying ? 'Pause Violin Theme' : 'Play Violin Theme'}
        aria-label={isPlaying ? 'Pause Violin Theme' : 'Play Violin Theme'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      {/* Mute/Unmute Button with neon glow */}
      <button
        onClick={handleToggleMute}
        className="p-1.5 sm:p-2 rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-700 neon-btn cursor-pointer"
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-600" />}
      </button>
    </div>
  );
};
