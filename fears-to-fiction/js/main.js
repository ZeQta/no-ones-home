import { GameManager } from './game/GameManager.js';

function createMenu(){
  const root = document.getElementById('app-root');
  const menu = document.createElement('div');
  menu.id = 'menu';
  menu.innerHTML = `
    <div class="menu-inner">
      <div class="menu-title">FEARS TO FICTION</div>
      <div class="menu-episode">Episode 1: No One's Home</div>
      <div class="menu-buttons">
        <button id="btn-start" class="menu-btn">START EPISODE</button>
        <button id="btn-settings" class="menu-btn">SETTINGS</button>
        <button id="btn-credits" class="menu-btn">CREDITS</button>
      </div>
      <div class="menu-warning">⚠️ Contains psychological horror elements. Headphones recommended.</div>
    </div>`;
  root.appendChild(menu);

  const settings = document.createElement('div');
  settings.id = 'settings';
  settings.innerHTML = `
    <div class="settings-panel">
      <h3>Graphics</h3>
      <div class="row"><label>Quality</label><select id="gfx-quality"><option>Low</option><option>Medium</option><option selected>High</option><option>Ultra</option></select></div>
      <div class="row"><label>Shadow Quality</label><select id="gfx-shadows"><option>Off</option><option>Low</option><option selected>Medium</option><option>High</option></select></div>
      <div class="row"><label>Post-Processing</label><input id="gfx-post" type="checkbox" class="toggle" checked></div>
      <h3>Audio</h3>
      <div class="row"><label>Master Volume</label><input id="vol-master" type="range" min="0" max="1" step="0.01" value="1"></div>
      <div class="row"><label>Music Volume</label><input id="vol-music" type="range" min="0" max="1" step="0.01" value="0.6"></div>
      <div class="row"><label>SFX Volume</label><input id="vol-sfx" type="range" min="0" max="1" step="0.01" value="0.8"></div>
      <div class="row"><label>Ambient Volume</label><input id="vol-amb" type="range" min="0" max="1" step="0.01" value="0.7"></div>
      <h3>Controls</h3>
      <div class="row"><label>Mouse Sensitivity</label><input id="ctl-sens" type="range" min="0.1" max="2" step="0.01" value="1"></div>
      <div class="row"><label>Invert Y-Axis</label><input id="ctl-invY" type="checkbox" class="toggle"></div>
      <div class="row"><label>Key Bindings</label><div>WASD, E, ESC, P</div></div>
      <div class="row" style="justify-content:flex-end;gap:10px;margin-top:14px;">
        <button id="btn-close-settings" class="menu-btn" style="width:180px;height:46px;">Close</button>
      </div>
    </div>`;
  root.appendChild(settings);

  const credits = document.createElement('div');
  credits.id = 'credits';
  credits.innerHTML = `<div class="credits-inner"><h2>Credits</h2><p>Design, Code, and Audio Integration: AI Assistant</p><p>Libraries: Three.js, Howler.js, postprocessing, tween.js, Cannon-ES</p><button id="btn-close-credits" class="menu-btn" style="width:220px;height:50px;margin-top:20px;">Close</button></div>`;
  root.appendChild(credits);

  document.getElementById('btn-settings').onclick = ()=> settings.classList.add('show');
  document.getElementById('btn-close-settings').onclick = ()=> settings.classList.remove('show');
  document.getElementById('btn-credits').onclick = ()=> credits.style.display = 'block';
  document.getElementById('btn-close-credits').onclick = ()=> credits.style.display = 'none';

  document.getElementById('btn-start').onclick = ()=>{
    menu.remove();
    startGame();
  };
}

function createHUD(){
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <div id="hint" class="hint"></div>
    <div id="interact" class="interact"></div>
    <div id="vignette" class="vignette"></div>
    <div id="blueTint" class="tint-blue"></div>
    <div id="phoneOverlay" class="phone-overlay">
      <div class="phone">
        <div class="phone-notch"></div>
        <button class="phone-close" id="phoneClose">✕</button>
        <div class="phone-screen" id="phoneScreen"></div>
      </div>
    </div>`;
  document.getElementById('app-root').appendChild(hud);
}

async function startGame(){
  createHUD();
  const gm = new GameManager(document.getElementById('app-root'));
  await gm.init();
  gm.start();
}

createMenu();