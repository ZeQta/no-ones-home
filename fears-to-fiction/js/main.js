import { GameManager } from './game/GameManager.js';
import { MenuUI } from './ui/MenuUI.js';
import { SettingsUI } from './ui/SettingsUI.js';
import { HUD } from './ui/HUD.js';
import { PhoneUI } from './ui/PhoneUI.js';

const appRoot = document.getElementById('app-root');

const ui = {
  menu: new MenuUI(),
  settings: new SettingsUI(),
  hud: new HUD(),
  phone: new PhoneUI(),
};

const game = new GameManager({ appRoot, ui });

ui.menu.onStart(() => {
  ui.menu.hide();
  game.start();
});

ui.menu.onOpenSettings(() => ui.settings.open(game));
ui.menu.onOpenCredits(() => game.showCredits());

ui.settings.onApply((settings) => {
  game.applySettings(settings);
});

ui.phone.onClose(() => game.onPhoneClosed());

// Show menu by default
ui.menu.show();

