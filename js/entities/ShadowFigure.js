/**
 * ShadowFigure - The antagonist entity
 */

import * as THREE from 'three';

export class ShadowFigure {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.isVisible = false;
        this.position = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
        this.movementSpeed = 0.5; // units per second
        
        this.appearanceStage = 0; // 0: hidden, 1: peripheral, 2: hallway, 3: bedroom
        
        this.init();
    }

    init() {
        // Create shadow figure mesh
        // Tall, dark, featureless humanoid
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            emissive: 0x2d1b4e,
            emissiveIntensity: 0.1,
            transparent: true,
            opacity: 1.0
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 1.1, 0);
        this.mesh.visible = false;
        this.mesh.castShadow = false; // Supernatural element
        
        // Add subtle glow effect
        const glowGeometry = new THREE.CylinderGeometry(0.35, 0.35, 2.25, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x2d1b4e,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(glow);
        
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        if (!this.isVisible) return;
        
        // Update any animations or movements
        if (this.appearanceStage === 3) {
            // Bedroom approach - handled by TWEEN in StoryManager
        }
    }

    show(position = null) {
        this.isVisible = true;
        this.mesh.visible = true;
        
        if (position) {
            this.setPosition(position);
        }
    }

    hide() {
        this.isVisible = false;
        this.mesh.visible = false;
    }

    setPosition(position) {
        if (position instanceof THREE.Vector3) {
            this.position.copy(position);
            this.mesh.position.copy(position);
        } else if (Array.isArray(position)) {
            this.position.set(position[0], position[1], position[2]);
            this.mesh.position.set(position[0], position[1], position[2]);
        }
    }

    moveTo(targetPosition, duration) {
        this.targetPosition.copy(targetPosition);
        
        // Use TWEEN for smooth movement
        if (typeof TWEEN !== 'undefined') {
            const start = { 
                x: this.mesh.position.x, 
                z: this.mesh.position.z 
            };
            const end = { 
                x: targetPosition.x, 
                z: targetPosition.z 
            };
            
            new TWEEN.Tween(start)
                .to(end, duration * 1000)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.mesh.position.x = start.x;
                    this.mesh.position.z = start.z;
                })
                .start();
        }
    }

    setAppearanceStage(stage) {
        this.appearanceStage = stage;
    }

    fadeIn(duration = 1.0) {
        this.show();
        this.mesh.material.opacity = 0;
        
        if (typeof TWEEN !== 'undefined') {
            const opacity = { value: 0 };
            new TWEEN.Tween(opacity)
                .to({ value: 1 }, duration * 1000)
                .easing(TWEEN.Easing.Quadratic.In)
                .onUpdate(() => {
                    this.mesh.material.opacity = opacity.value;
                })
                .start();
        } else {
            this.mesh.material.opacity = 1;
        }
    }

    fadeOut(duration = 1.0) {
        if (typeof TWEEN !== 'undefined') {
            const opacity = { value: this.mesh.material.opacity };
            new TWEEN.Tween(opacity)
                .to({ value: 0 }, duration * 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.mesh.material.opacity = opacity.value;
                })
                .onComplete(() => {
                    this.hide();
                })
                .start();
        } else {
            this.hide();
        }
    }

    playPresenceSound() {
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'shadowPresence', loop: true }
        }));
    }

    stopPresenceSound() {
        // Would stop the looping sound
    }

    getPosition() {
        return this.position;
    }

    getMesh() {
        return this.mesh;
    }
}

export default ShadowFigure;