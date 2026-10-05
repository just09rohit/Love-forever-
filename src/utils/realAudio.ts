/**
 * Real Hindi Love Music Engine
 * Prioritizes Heart-Melting Hindi Bollywood Love Melodies:
 * 1. Tum Hi Ho · Meri Aashiqui
 * 2. Tere Hawaale · Soulful Devotion
 * 3. Raataan Lambiyan · Night Romance
 * 4. Kesariya · Ishq Hai Piya
 * 5. Tum Se Hi · Jab We Met
 * 6. Pehla Nasha · Classic Romance
 * Plus Custom MP3 song upload (upload any Hindi song file!)
 */

import { soundEngine } from './audio';

export interface RealTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  type: 'stream' | 'synth' | 'custom';
}

export const REAL_TRACKS: RealTrack[] = [
  {
    id: 'hello_violin_theme',
    title: 'Hello · Violin Theme (Middle Part)',
    artist: 'South Movie "Hello" (Taqdeer) · Anup Rubens',
    src: 'https://youtu.be/gyagxPoll2k',
    type: 'synth',
  },
];

class RealMusicEngine {
  private audioElement: HTMLAudioElement | null = null;
  private currentTrack: RealTrack = REAL_TRACKS[0];
  private isPlaying: boolean = true;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private customSongUrl: string | null = null;
  private onStateChangeCallbacks: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.addEventListener('playing', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audioElement.addEventListener('error', () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(cb: () => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((c) => c !== cb);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb());
  }

  public getCurrentTrack(): RealTrack {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setCustomTrack(file: File) {
    if (this.customSongUrl) {
      URL.revokeObjectURL(this.customSongUrl);
    }
    const url = URL.createObjectURL(file);
    this.customSongUrl = url;

    const customTrack: RealTrack = {
      id: 'custom_user_song',
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Your Hindi Love Song (MP3)',
      src: url,
      type: 'custom',
    };

    soundEngine.stopMusic();
    this.playTrack(customTrack);
  }

  public playTrack(track: RealTrack) {
    this.currentTrack = track;

    if (track.type === 'stream' || track.type === 'custom') {
      soundEngine.stopMusic();
      if (this.audioElement) {
        this.audioElement.src = track.src;
        this.audioElement.play().then(() => {
          this.isPlaying = true;
          this.notify();
        }).catch(() => {});
      }
    } else {
      // Hindi procedural synth mode
      if (this.audioElement) {
        this.audioElement.pause();
      }
      const tuneId = track.id.replace('synth_', '');
      soundEngine.setTune(tuneId);
      soundEngine.startMusic();
      this.isPlaying = true;
      this.notify();
    }
  }

  public togglePlay() {
    if (this.currentTrack.type === 'synth') {
      const playing = soundEngine.toggleMusic();
      this.isPlaying = playing;
    } else {
      if (!this.audioElement) return;
      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
      } else {
        this.audioElement.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {});
      }
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    soundEngine.toggleMute();
    this.notify();
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    soundEngine.setVolume(this.volume);
    this.notify();
  }
}

export const realMusicEngine = new RealMusicEngine();
