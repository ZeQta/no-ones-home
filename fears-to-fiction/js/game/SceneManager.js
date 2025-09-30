import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/postprocessing@6.35.3/build/postprocessing.esm.js';
import { RenderPass } from 'https://unpkg.com/postprocessing@6.35.3/build/postprocessing.esm.js';
import { EffectPass } from 'https://unpkg.com/postprocessing@6.35.3/build/postprocessing.esm.js';
import { VignetteEffect, NoiseEffect, BloomEffect, SMAAEffect } from 'https://unpkg.com/postprocessing@6.35.3/build/postprocessing.esm.js';

export class SceneManager {
  constructor({ appRoot, audio }) {
    this.appRoot = appRoot;
    this.audio = audio;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.composer = null;
    this.effects = {};
    this.rooms = {};
    this.lights = {};
  }

  async init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.appRoot.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a0a0a');

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.6, 0);

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.effects.vignette = new VignetteEffect({ darkness: 0.9, offset: 0.5 });
    this.effects.noise = new NoiseEffect({ premultiply: true });
    this.effects.bloom = new BloomEffect({ intensity: 0.3 });
    this.effects.smaa = new SMAAEffect();
    const postPass = new EffectPass(this.camera, this.effects.vignette, this.effects.noise, this.effects.bloom, this.effects.smaa);
    this.composer.addPass(postPass);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
    });

    this._buildHouse();
  }

  _buildHouse() {
    // Simple procedural house layout based on spec dimensions
    const floorTex = new THREE.MeshStandardMaterial({ color: '#8b6f47', roughness: 0.8, metalness: 0.0 });
    const tileTex = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.9 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#f5f5dc' });

    // Floor plane for entire house bounds 30x20
    const floorGeom = new THREE.PlaneGeometry(30, 20);
    const floor = new THREE.Mesh(floorGeom, floorTex);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Create rooms as simple boxes without ceilings for performance
    const addRoom = (name, x, z, w, d, color = '#f5f5dc') => {
      const group = new THREE.Group();
      const mat = wallMat.clone();
      mat.color = new THREE.Color(color);

      const wallGeom1 = new THREE.BoxGeometry(w, 3, 0.3);
      const wallGeom2 = new THREE.BoxGeometry(0.3, 3, d);
      const north = new THREE.Mesh(wallGeom1, mat);
      north.position.set(x, 1.5, z - d / 2);
      const south = new THREE.Mesh(wallGeom1, mat);
      south.position.set(x, 1.5, z + d / 2);
      const west = new THREE.Mesh(wallGeom2, mat);
      west.position.set(x - w / 2, 1.5, z);
      const east = new THREE.Mesh(wallGeom2, mat);
      east.position.set(x + w / 2, 1.5, z);
      [north, south, west, east].forEach(m => { m.castShadow = true; m.receiveShadow = true; group.add(m); });

      // Room floor
      const rfGeom = new THREE.PlaneGeometry(w, d);
      const rfMat = (name === 'Kitchen' || name === 'Bathroom') ? tileTex : floorTex;
      const rf = new THREE.Mesh(rfGeom, rfMat);
      rf.rotation.x = -Math.PI / 2;
      rf.position.set(x, 0.01, z);
      rf.receiveShadow = true;
      group.add(rf);

      this.scene.add(group);
      this.rooms[name] = { group, bounds: { x, z, w, d } };
      return group;
    };

    // Layout per spec
    // Assume house centered at (0,0); place rooms accordingly
    addRoom('Bedroom', -9, 6.5, 6, 5);
    addRoom('LivingRoom', 5, 4, 10, 8, '#d3d3d3');
    addRoom('Hallway', 1, 0, 12, 3);
    addRoom('Kitchen', 7.5, -6.5, 8, 6, '#fafafa');
    addRoom('Bathroom', -9, 0, 4, 4, '#ffffff');

    // Basic lighting
    const ambient = new THREE.AmbientLight('#ffffff', 0.25);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight('#ffffff', 0.4);
    dir.position.set(10, 15, 10);
    dir.castShadow = true;
    this.scene.add(dir);

    // Room lights
    const addCeilingLight = (name, x, z, color = 0xffdb99, intensity = 1.2) => {
      const light = new THREE.PointLight(color, intensity, 12, 2);
      light.position.set(x, 2.8, z);
      light.castShadow = false;
      this.scene.add(light);
      this.lights[name] = light;
      return light;
    };
    addCeilingLight('Bedroom', -9, 6.5, 0xffdb99, 1.3);
    addCeilingLight('LivingRoom', 5, 4, 0xffdb99, 1.0);
    addCeilingLight('Hallway', 1, 0, 0xffdb99, 0.9);
    addCeilingLight('Kitchen', 7.5, -6.5, 0xffffff, 1.6);
    addCeilingLight('Bathroom', -9, 0, 0xffffff, 1.4);

    // Simple props: a bed, couch, TV as boxes to support interactions
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1.5), new THREE.MeshStandardMaterial({ color: '#3d2817' }));
    bed.position.set(-10, 0.25, 8);
    bed.castShadow = bed.receiveShadow = true;
    bed.userData = { name: 'Bed', type: 'examine', message: "You don't want to sleep right now" };
    this.scene.add(bed);

    const tv = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: '#111', emissive: '#111' }));
    tv.position.set(6, 1.0, 0.5);
    tv.rotation.y = Math.PI;
    tv.userData = { name: 'TV', type: 'toggle_tv', isOn: false };
    this.scene.add(tv);

    const couch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1, 1), new THREE.MeshStandardMaterial({ color: '#6e6e6e' }));
    couch.position.set(4, 0.5, 6);
    couch.userData = { name: 'Couch', type: 'examine', message: 'You should explore the house first' };
    this.scene.add(couch);

    // Start position in bedroom
    this.camera.position.set(-9, 1.6, 7.2);
  }

  applySettings(settings) {
    const pixelRatio = Math.min(2, (settings.graphicsQuality === 'Ultra') ? window.devicePixelRatio : (settings.graphicsQuality === 'Low' ? 1 : window.devicePixelRatio * 0.85));
    this.renderer.setPixelRatio(pixelRatio);
    this.effects.bloom.intensity = settings.postProcessing ? 0.3 : 0.0;
  }

  render(dt) {
    this.composer.render();
  }
}

