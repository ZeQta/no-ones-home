import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

export class AssetLoader {
  constructor() {
    this.gltf = new GLTFLoader();
    this.texture = new THREE.TextureLoader();
    this.cache = new Map();
  }
  async loadGLTF(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const model = await this.gltf.loadAsync(url);
    this.cache.set(url, model);
    return model;
  }
  async loadTexture(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const tex = await this.texture.loadAsync(url);
    tex.encoding = THREE.sRGBEncoding;
    this.cache.set(url, tex);
    return tex;
  }
}

