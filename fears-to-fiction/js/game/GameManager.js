import { SceneManager } from './SceneManager.js';
import { PlayerController } from './PlayerController.js';
import { StoryManager } from './StoryManager.js';
import { PhaseManager } from './PhaseManager.js';
import { AudioManager } from '../audio/AudioManager.js';

export class GameManager {
  constructor({ appRoot, ui }) {
    this.appRoot = appRoot;
    this.ui = ui;
    this.clock = null;
    this.sceneManager = null;
    this.player = null;
    this.story = null;
    this.phase = null;
    this.audio = null;
    this.running = false;
    this._loop = this._loop.bind(this);
  }

  async start() {
    if (this.running) return;
    this.running = true;
    this.audio = new AudioManager();
    await this.audio.init();

    this.sceneManager = new SceneManager({ appRoot: this.appRoot, audio: this.audio });
    await this.sceneManager.init();

    this.player = new PlayerController({ scene: this.sceneManager.scene, camera: this.sceneManager.camera, dom: this.sceneManager.renderer.domElement, audio: this.audio, ui: this.ui });
    this.phase = new PhaseManager({ audio: this.audio, ui: this.ui });
    this.story = new StoryManager({ sceneManager: this.sceneManager, player: this.player, phase: this.phase, audio: this.audio, ui: this.ui, game: this });

    this.clock = performance;
    this.lastTime = this.clock.now();
    this._loop();
    this.story.beginOpeningCutscene();
  }

  _loop() {
    if (!this.running) return;
    const now = this.clock.now();
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.player?.update(dt);
    this.story?.update(dt);
    this.phase?.update(dt);
    this.sceneManager?.render(dt);

    requestAnimationFrame(this._loop);
  }

  applySettings(settings) {
    this.player?.applySettings(settings);
    this.sceneManager?.applySettings(settings);
    this.audio?.applySettings(settings);
  }

  showCredits() {
    document.getElementById('credits').classList.remove('hidden');
  }

  onPhoneClosed() {
    this.story?.onPhoneClosed();
  }
}

