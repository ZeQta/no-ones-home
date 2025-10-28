export class MenuUI {
  constructor() {
    this.root = document.getElementById('main-menu');
    this.btnStart = document.getElementById('btn-start');
    this.btnSettings = document.getElementById('btn-settings');
    this.btnCredits = document.getElementById('btn-credits');
    this._startCb = () => {};
    this._settingsCb = () => {};
    this._creditsCb = () => {};
    this.btnStart.addEventListener('click', () => this._startCb());
    this.btnSettings.addEventListener('click', () => this._settingsCb());
    this.btnCredits.addEventListener('click', () => this._creditsCb());
  }
  onStart(cb) { this._startCb = cb; }
  onOpenSettings(cb) { this._settingsCb = cb; }
  onOpenCredits(cb) { this._creditsCb = cb; }
  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }
}

