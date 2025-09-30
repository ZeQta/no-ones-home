import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

export class PlayerController {
  constructor({ scene, camera, dom, audio, ui }) {
    this.scene = scene;
    this.camera = camera;
    this.dom = dom;
    this.audio = audio;
    this.ui = ui;

    this.controls = new PointerLockControls(this.camera, document.body);
    // Adjust look speed via mouse sensitivity
    const origOnMouseMove = this.controls.onMouseMove.bind(this.controls);
    this.controls.onMouseMove = (event) => {
      const scaledEvent = { movementX: event.movementX * this.mouseSensitivity, movementY: (this.invertY ? -1 : 1) * event.movementY * this.mouseSensitivity };
      // Patch controls internals by temporarily overriding mouse deltas
      const e = { movementX: scaledEvent.movementX, movementY: scaledEvent.movementY };
      // Call original handler with adjusted deltas
      origOnMouseMove({ movementX: e.movementX, movementY: e.movementY });
    };
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.move = { forward: false, back: false, left: false, right: false, sprint: false };
    this.walkSpeed = 3.5;
    this.sprintMult = 1.5;
    this.mouseSensitivity = 1.0;
    this.invertY = false;
    this.raycaster = new THREE.Raycaster();
    this.interactionRange = 1.5;
    this.currentInteractable = null;
    this.fear = 0;
    this._headBobTime = 0;
    this._cameraBaseY = this.camera.position.y;

    this._bind();
    this._setupVFXOverlays();
  }

  _setupVFXOverlays() {
    this.vignette = document.createElement('div');
    this.vignette.className = 'vignette';
    this.dom.parentElement.appendChild(this.vignette);
    this.blueTint = document.createElement('div');
    this.blueTint.className = 'blue-tint';
    this.dom.parentElement.appendChild(this.blueTint);
  }

  _bind() {
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW': this.move.forward = true; break;
        case 'KeyS': this.move.back = true; break;
        case 'KeyA': this.move.left = true; break;
        case 'KeyD': this.move.right = true; break;
        case 'ShiftLeft': this.move.sprint = true; break;
        case 'KeyE': this._interact(); break;
        case 'KeyP': this.ui.phone.toggle(); break;
      }
    });
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': this.move.forward = false; break;
        case 'KeyS': this.move.back = false; break;
        case 'KeyA': this.move.left = false; break;
        case 'KeyD': this.move.right = false; break;
        case 'ShiftLeft': this.move.sprint = false; break;
      }
    });

    // Click to lock pointer
    this.dom.addEventListener('click', () => {
      if (!this.controls.isLocked) this.controls.lock();
    });

    this.controls.addEventListener('lock', () => {});
    this.controls.addEventListener('unlock', () => {});
  }

  applySettings(settings) {
    this.mouseSensitivity = settings.mouseSensitivity || 1.0;
    this.invertY = settings.invertY || false;
  }

  setFear(value) {
    this.fear = Math.max(0, Math.min(100, value));
    const vignetteOpacity = this.fear <= 25 ? 0 : this.fear <= 50 ? 0.15 : this.fear <= 75 ? 0.3 : 0.45;
    const blue = this.fear <= 50 ? 0 : this.fear <= 75 ? 0.1 : 0.25;
    this.vignette.style.opacity = String(vignetteOpacity);
    this.blueTint.style.opacity = String(blue);
  }

  update(dt) {
    // Movement
    const speed = this.walkSpeed * (this.move.sprint ? this.sprintMult : 1);
    this.direction.set(0, 0, 0);
    if (this.move.forward) this.direction.z -= 1;
    if (this.move.back) this.direction.z += 1;
    if (this.move.left) this.direction.x -= 1;
    if (this.move.right) this.direction.x += 1;
    this.direction.normalize();
    const moveVec = new THREE.Vector3();
    this.controls.getObject().getWorldDirection(moveVec);
    const forward = new THREE.Vector3(moveVec.x, 0, moveVec.z).normalize();
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
    const pos = this.controls.getObject().position;
    const moving = (this.direction.x !== 0 || this.direction.z !== 0);
    pos.addScaledVector(forward, this.direction.z * speed * dt);
    pos.addScaledVector(right, -this.direction.x * speed * dt);

    // Head bob and fear shake
    if (moving) this._headBobTime += dt * 10; else this._headBobTime *= 0.9;
    const headBob = Math.sin(this._headBobTime) * 0.05;
    const fearShake = (this.fear / 100) * 0.1;
    this.camera.position.y = this._cameraBaseY + headBob + (Math.random() - 0.5) * fearShake;

    // Interaction raycast
    this._updateInteraction();
  }

  _updateInteraction() {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    let found = null;
    for (const i of intersects) {
      if (i.distance > this.interactionRange) break;
      if (i.object && i.object.userData && i.object.userData.name) { found = i.object; break; }
    }
    this.currentInteractable = found;
    if (found) {
      this.ui.hud.showInteraction(`[E] Interact with ${found.userData.name}`);
    } else {
      this.ui.hud.hideInteraction();
    }
  }

  _interact() {
    const obj = this.currentInteractable;
    if (!obj) return;
    const ud = obj.userData || {};
    if (ud.type === 'examine') {
      this.ui.hud.showObjective(ud.message || '...');
    } else if (ud.type === 'toggle_tv') {
      ud.isOn = !ud.isOn;
      obj.material.emissive = new THREE.Color(ud.isOn ? '#4a90e2' : '#111');
      this.ui.hud.showObjective(ud.isOn ? 'The TV turns on but shows only static' : 'TV turned off');
    }
  }
}

