import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class ShadowFigure {
  constructor() {
    this.group = new THREE.Group();
    const bodyGeo = new THREE.CapsuleGeometry(0.45, 1.3, 8, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 1, metalness: 0 });
    const body = new THREE.Mesh(bodyGeo, mat);
    body.castShadow = false;
    body.receiveShadow = false;
    this.group.add(body);

    // Subtle purple outline using second mesh slightly scaled
    const outlineMat = new THREE.MeshBasicMaterial({ color: '#2d1b4e', side: THREE.BackSide });
    const outline = new THREE.Mesh(bodyGeo, outlineMat);
    outline.scale.multiplyScalar(1.04);
    this.group.add(outline);

    this.group.visible = false;
  }
}

