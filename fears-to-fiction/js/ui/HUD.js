export class HUD {
  constructor() {
    this.root = document.getElementById('hud');
    this.objective = document.getElementById('objective');
    this.interaction = document.getElementById('interaction');
  }
  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }
  showObjective(text) {
    this.objective.textContent = text;
    this.objective.classList.add('show');
    this.show();
    clearTimeout(this._objTimeout);
    this._objTimeout = setTimeout(() => this.objective.classList.remove('show'), 10000);
  }
  showInteraction(text) {
    this.interaction.textContent = text;
    this.interaction.classList.add('show');
    this.show();
  }
  hideInteraction() {
    this.interaction.classList.remove('show');
  }
}

