export class PhaseManager {
  constructor({ audio, ui }) {
    this.audio = audio;
    this.ui = ui;
    this.phase = 0;
  }

  setPhase(p) {
    this.phase = p;
    this.audio.setMusicPhase(p);
  }

  update(dt) {}
}

