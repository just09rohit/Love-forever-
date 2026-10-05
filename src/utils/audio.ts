/**
 * Web Audio API Synthesizer for Heart-Melting Romantic Love Tunes
 * Features warm acoustic piano chords, tender bansuri (flute) meend pitch glides,
 * dreamy string pad swells, and sparkling chimes.
 */

export interface HindiMelodyNote {
  freq: number;
  duration: number; // in beats
  glideTo?: number; // microtonal meend glide
}

export interface HindiTune {
  id: string;
  title: string;
  subtitle: string;
  tempo: number; // BPM
  chords: number[][];
  melody: HindiMelodyNote[];
}

// Romantic frequency notes (Hz)
const C3 = 130.81, D3 = 146.83, Ds3 = 155.56, E3 = 164.81, F3 = 174.61, G3 = 196.00, Gs3 = 207.65, A3 = 220.00, As3 = 233.08, B3 = 246.94;
const C4 = 261.63, Cs4 = 277.18, D4 = 293.66, Ds4 = 311.13, E4 = 329.63, F4 = 349.23, Fs4 = 369.99, G4 = 392.00, Gs4 = 415.30, A4 = 440.00, As4 = 466.16, B4 = 493.88;
const C5 = 523.25, Cs5 = 554.37, D5 = 587.33, Ds5 = 622.25, E5 = 659.25, F5 = 698.46, Fs5 = 739.99, G5 = 783.99, Gs5 = 830.61, A5 = 880.00, As5 = 932.33, B5 = 987.77, C6 = 1046.50;
const D6 = 1174.66, Ds6 = 1244.51, E6 = 1318.51, F6 = 1396.91, G6 = 1567.98;

export const HINDI_TUNES: HindiTune[] = [
  {
    id: 'hello_violin_theme',
    title: 'Hello · Violin Theme (Middle Part)',
    subtitle: 'South Movie "Hello" (Taqdeer) · Anup Rubens',
    tempo: 72,
    chords: [
      [D3, A3, D4, F4],       // D minor
      [As3 / 2, F3, As3, D4], // Bb Major
      [C3, G3, C4, E4],       // C Major
      [D3, A3, D4, F4],       // D minor
      [G3 / 2, D3, G3, As3],  // G minor
      [C3, G3, C4, E4],       // C Major
      [F3 / 2, C3, F3, A3],   // F Major
      [A3 / 2, E3, A3, Cs4],  // A Major
    ],
    melody: [
      // Middle Part: Soaring romantic solo violin (Anaganaga Oka Uru / Ek Aisa Woh Jaha Tha)
      { freq: D5, duration: 1.0 },
      { freq: E5, duration: 1.0 },
      { freq: F5, duration: 2.0, glideTo: G5 },
      { freq: G5, duration: 1.0 },
      { freq: A5, duration: 2.5 },
      { freq: D6, duration: 2.0, glideTo: C6 },
      { freq: C6, duration: 1.5 },
      { freq: A5, duration: 2.5 },
      // Tender second phrase
      { freq: A5, duration: 1.0 },
      { freq: G5, duration: 1.0 },
      { freq: F5, duration: 1.8, glideTo: E5 },
      { freq: G5, duration: 1.0 },
      { freq: A5, duration: 2.0 },
      { freq: F5, duration: 1.5, glideTo: E5 },
      { freq: E5, duration: 1.5 },
      { freq: D5, duration: 3.0 },
      // High climactic soaring violin peak
      { freq: D5, duration: 1.0 },
      { freq: E5, duration: 1.0 },
      { freq: F5, duration: 1.8 },
      { freq: G5, duration: 1.0 },
      { freq: A5, duration: 2.0 },
      { freq: D6, duration: 2.0, glideTo: F6 },
      { freq: F6, duration: 2.2, glideTo: E6 },
      { freq: E6, duration: 1.5 },
      { freq: D6, duration: 1.5 },
      { freq: C6, duration: 2.5 },
      // Grand emotional resolution
      { freq: A5, duration: 1.0 },
      { freq: C6, duration: 1.0 },
      { freq: D6, duration: 2.0 },
      { freq: E6, duration: 1.5 },
      { freq: F6, duration: 2.0, glideTo: E6 },
      { freq: D6, duration: 1.5, glideTo: C6 },
      { freq: D6, duration: 4.0 },
    ],
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = true;
  private currentTuneIndex: number = 0;
  private musicVolume: number = 0.38;

  private melodyTimer: number | null = null;
  private chordTimer: number | null = null;
  private noteIndex: number = 0;
  private chordIndex: number = 0;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
            this.ctx.resume().catch(() => {});
          }
          if (this.isMusicPlaying && !this.isMuted && !this.melodyTimer) {
            this.startMusic();
          }
        }
      });
      window.addEventListener('focus', () => {
        if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
          this.ctx.resume().catch(() => {});
        }
      });
    }
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getCurrentTune(): HindiTune {
    return HINDI_TUNES[this.currentTuneIndex];
  }

  public setTune(tuneId: string) {
    const idx = HINDI_TUNES.findIndex((t) => t.id === tuneId);
    if (idx !== -1) {
      this.currentTuneIndex = idx;
      this.noteIndex = 0;
      this.chordIndex = 0;
      if (this.isMusicPlaying && !this.isMuted) {
        this.restartMusicLoop();
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.isMusicPlaying = true;
      this.startMusic();
    }
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      this.isMusicPlaying = false;
    } else {
      this.isMusicPlaying = true;
      this.isMuted = false;
      this.startMusic();
    }
    return this.isMusicPlaying;
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public startMusic() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    this.isMusicPlaying = true;
    this.restartMusicLoop();
  }

  private restartMusicLoop() {
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    if (this.chordTimer) clearTimeout(this.chordTimer);

    this.playNextChordBar();
    this.playNextMelodyNote();
  }

  public stopMusic() {
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    if (this.chordTimer) clearTimeout(this.chordTimer);
    this.melodyTimer = null;
    this.chordTimer = null;
  }

  /**
   * Warm ambient pad chord progression with soft acoustic warmth
   */
  private playNextChordBar() {
    if (!this.isMusicPlaying || this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const tune = HINDI_TUNES[this.currentTuneIndex];
    const chord = tune.chords[this.chordIndex % tune.chords.length];
    this.chordIndex++;

    const beatDuration = 60 / tune.tempo;
    const barDuration = beatDuration * 4;
    const now = this.ctx.currentTime;

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.linearRampToValueAtTime(900, now + barDuration * 0.5);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 1.2);
      gain.gain.setValueAtTime(0.065, now + barDuration - 0.8);
      gain.gain.linearRampToValueAtTime(0.001, now + barDuration);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + barDuration);
      oscHarmonic.stop(now + barDuration);
    });

    this.chordTimer = window.setTimeout(() => {
      this.playNextChordBar();
    }, barDuration * 1000);
  }

  /**
   * Expressive Solo Violin & Orchestral String Lead
   * Specifically crafted for South Movie "Hello" Violin BGM
   */
  private playNextMelodyNote() {
    if (!this.isMusicPlaying || this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const tune = HINDI_TUNES[this.currentTuneIndex];
    const note = tune.melody[this.noteIndex % tune.melody.length];
    this.noteIndex++;

    const beatDuration = 60 / tune.tempo;
    const noteSeconds = note.duration * beatDuration;
    const now = this.ctx.currentTime;

    // Solo Violin dual oscillator for rich acoustic bow resonance
    const osc = this.ctx.createOscillator();
    const oscBody = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(note.freq, now);

    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(note.freq, now);

    if (note.glideTo) {
      osc.frequency.exponentialRampToValueAtTime(note.glideTo, now + noteSeconds * 0.85);
      oscBody.frequency.exponentialRampToValueAtTime(note.glideTo, now + noteSeconds * 0.85);
    }

    // Expressive romantic violin vibrato (5.6 Hz)
    lfo.frequency.setValueAtTime(5.6, now);
    lfoGain.gain.setValueAtTime(3.2, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(oscBody.frequency);

    // Warm violin acoustic body filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.setValueAtTime(1.8, now);

    // Expressive violin bowing envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.12);
    gain.gain.setValueAtTime(0.20, now + noteSeconds * 0.75);
    gain.gain.linearRampToValueAtTime(0.001, now + noteSeconds);

    osc.connect(filter);
    oscBody.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    oscBody.start(now);
    lfo.start(now);
    osc.stop(now + noteSeconds);
    oscBody.stop(now + noteSeconds);
    lfo.stop(now + noteSeconds);

    const gap = (noteSeconds + 0.05) * 1000;
    this.melodyTimer = window.setTimeout(() => {
      this.playNextMelodyNote();
    }, gap);
  }

  // SOUND FX: Balloon pop
  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.12);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
    this.playChime(622.25, 0.08, 0.15);
  }

  // SOUND FX: Scratch
  public playScratch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const randFreq = 650 + Math.random() * 300;
    osc.frequency.setValueAtTime(randFreq, t);
    osc.frequency.linearRampToValueAtTime(randFreq * 0.65, t + 0.04);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // SOUND FX: Chime
  public playChime(freq: number, duration = 0.4, volume = 0.2) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  // SOUND FX: 3D Card Open
  public playCardOpen() {
    if (this.isMuted) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 0.5, 0.15), idx * 70);
    });
  }

  // SOUND FX: Lock Unlock
  public playUnlock() {
    if (this.isMuted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 0.6, 0.2), idx * 90);
    });
  }

  // SOUND FX: Grand Fanfare
  public playFanfare() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 0 },
      { f: 659.25, d: 150 },
      { f: 783.99, d: 300 },
      { f: 1046.50, d: 450 },
      { f: 1318.51, d: 650 },
      { f: 1567.98, d: 850 },
      { f: 2093.00, d: 1100 }
    ];
    notes.forEach(({ f, d }) => {
      setTimeout(() => this.playChime(f, 0.8, 0.25), d);
    });
  }
}

export const soundEngine = new SoundEngine();
