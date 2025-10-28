export class SettingsUI {
  constructor() {
    this.root = document.getElementById('settings-modal');
    this.btnClose = document.getElementById('settings-close');
    this.btnApply = document.getElementById('settings-apply');
    this.btnCancel = document.getElementById('settings-cancel');

    this.ddQuality = document.getElementById('graphics-quality');
    this.ddShadow = document.getElementById('shadow-quality');
    this.cbPostFX = document.getElementById('postfx-toggle');
    this.rMaster = document.getElementById('vol-master');
    this.rMusic = document.getElementById('vol-music');
    this.rAmbient = document.getElementById('vol-ambient');
    this.rSfx = document.getElementById('vol-sfx');
    this.rSens = document.getElementById('mouse-sens');
    this.cbInvertY = document.getElementById('invert-y');

    this._applyCb = () => {};
    const close = () => this.close();
    this.btnClose.addEventListener('click', close);
    this.btnCancel.addEventListener('click', close);
    this.btnApply.addEventListener('click', () => this._apply());
  }

  onApply(cb) { this._applyCb = cb; }

  open() { this.root.classList.remove('hidden'); }
  close() { this.root.classList.add('hidden'); }

  _apply() {
    const settings = {
      graphicsQuality: this.ddQuality.value,
      shadowQuality: this.ddShadow.value,
      postProcessing: this.cbPostFX.checked,
      volumes: { master: parseFloat(this.rMaster.value), music: parseFloat(this.rMusic.value), ambient: parseFloat(this.rAmbient.value), sfx: parseFloat(this.rSfx.value) },
      mouseSensitivity: parseFloat(this.rSens.value),
      invertY: this.cbInvertY.checked,
    };
    this._applyCb(settings);
    this.close();
  }
}

