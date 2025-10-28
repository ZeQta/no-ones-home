import { Howl, Howler } from 'https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.core.min.js';

export class AudioManager {
  constructor() {
    this.tracks = { music: {}, ambient: {}, sfx: {} };
    this.master = 0.8; this.music = 0.5; this.ambient = 0.7; this.sfx = 0.8;
    this.ducking = { active: false, target: 0.6, restoreTimeout: null };
  }

  async init() {
    Howler.volume(this.master);
    // Placeholder procedural sounds via data URIs or empty; hook ready for real assets
    this.tracks.music.menu = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], loop: true, volume: this.music * 0.6 });
    this.tracks.music.p1 = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], loop: true, volume: this.music * 0.3 });
    this.tracks.music.p2 = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], loop: true, volume: this.music * 0.4 });
    this.tracks.music.p3 = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], loop: true, volume: this.music * 0.5 });
    this.tracks.music.p4 = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], loop: true, volume: this.music * 0.7 });

    this.tracks.sfx.phone = new Howl({ src: ['https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3'], volume: this.sfx });
  }

  applySettings(settings) {
    this.master = settings.volumes?.master ?? this.master;
    this.music = settings.volumes?.music ?? this.music;
    this.ambient = settings.volumes?.ambient ?? this.ambient;
    this.sfx = settings.volumes?.sfx ?? this.sfx;
    Howler.volume(this.master);
  }

  setMusicPhase(p) {
    Object.values(this.tracks.music).forEach(h => h.stop());
    const map = { 0: 'menu', 1: 'p1', 2: 'p2', 3: 'p3', 4: 'p4' };
    const key = map[p] || 'p1';
    const track = this.tracks.music[key];
    if (track) track.play();
  }
}

