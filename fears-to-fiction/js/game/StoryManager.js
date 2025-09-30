export class StoryManager {
  constructor({ sceneManager, player, phase, audio, ui, game }) {
    this.sceneManager = sceneManager;
    this.player = player;
    this.phase = phase;
    this.audio = audio;
    this.ui = ui;
    this.game = game;
    this.time = 0;
    this.state = 'init';
    this.eventsFired = new Set();
  }

  beginOpeningCutscene() {
    this.state = 'opening';
    this.time = 0;
    // Play phone notification SFX and show phone after short delay
    setTimeout(() => {
      this.audio.tracks?.sfx?.phone?.play();
      this.ui.phone.showMessage({
        from: 'Mom ❤️',
        text: 'All the doors are locked from outside, food is in the fridge, eat fast, I am out for work trip and will be there by morning',
        timestamp: '6:32 PM'
      });
    }, 1500);
  }

  onPhoneClosed() {
    if (this.state === 'opening') {
      this.state = 'freeplay';
      this.phase.setPhase(1);
      this.ui.hud.showObjective('Explore the house');
    }
  }

  update(dt) {
    if (this.state === 'init') return;
    this.time += dt;

    // Timed phase transitions (coarse initial mapping)
    if (this.time > 180 && !this.eventsFired.has('phase2')) { // 3 min
      this.eventsFired.add('phase2');
      this.phase.setPhase(2);
      this.ui.hud.showObjective('Something feels off...');
      this.player.setFear(this.player.fear + 5);
    }
    if (this.time > 660 && !this.eventsFired.has('phase3')) { // 11 min
      this.eventsFired.add('phase3');
      this.phase.setPhase(3);
      this.ui.hud.showObjective('Get to safety');
      this.player.setFear(this.player.fear + 15);
    }
  }
}

