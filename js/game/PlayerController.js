/**
 * PlayerController - First-person movement and interaction
 */

export class PlayerController {
    constructor(camera, scene, domElement) {
        this.camera = camera;
        this.scene = scene;
        this.domElement = domElement;
        
        this.controls = null;
        this.isLocked = false;
        
        // Movement
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.sprint = false;
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Movement parameters
        this.walkSpeed = 3.5;
        this.sprintSpeed = 5.5;
        this.currentSpeed = this.walkSpeed;
        
        // Camera settings
        this.sensitivity = 1.0;
        this.invertY = false;
        
        // Head bob
        this.headBobTime = 0;
        this.headBobAmplitude = 0.05;
        this.headBobFrequency = 10;
        
        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 1.5;
        this.interactableObjects = [];
        this.currentInteractable = null;
        
        // Fear effects
        this.fearShakeAmount = 0;
        this.fearLevel = 0;
    }

    async init() {
        // Create pointer lock controls
        this.controls = new THREE.PointerLockControls(this.camera, this.domElement);
        this.scene.add(this.controls.getObject());
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Player controller initialized');
    }

    setupEventListeners() {
        // Pointer lock events
        this.controls.addEventListener('lock', () => {
            this.isLocked = true;
        });
        
        this.controls.addEventListener('unlock', () => {
            this.isLocked = false;
        });
        
        // Keyboard input
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Click to lock pointer (when controls enabled)
        this.domElement.addEventListener('click', () => {
            if (!this.isLocked) {
                this.lock(true);
            }
        });
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.sprint = true;
                break;
            case 'KeyE':
                this.interact();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyD':
                this.moveRight = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.sprint = false;
                break;
        }
    }

    update(deltaTime) {
        if (!this.controls || !this.isLocked) return;
        
        // Update speed based on sprint
        this.currentSpeed = this.sprint ? this.sprintSpeed : this.walkSpeed;
        
        // Calculate movement direction
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();
        
        // Apply movement
        const isMoving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
        
        if (isMoving) {
            this.velocity.z = this.direction.z * this.currentSpeed * deltaTime;
            this.velocity.x = this.direction.x * this.currentSpeed * deltaTime;
            
            // Apply head bob
            this.headBobTime += deltaTime * this.headBobFrequency;
            const bobOffset = Math.sin(this.headBobTime) * this.headBobAmplitude;
            this.camera.position.y = 1.6 + bobOffset;
            
            // Play footstep sounds periodically
            if (Math.floor(this.headBobTime * 2) % 2 === 0 && this.headBobTime % 1 < 0.1) {
                this.playFootstepSound();
            }
        } else {
            this.velocity.z = 0;
            this.velocity.x = 0;
            this.camera.position.y = 1.6;
        }
        
        // Apply fear shake
        if (this.fearShakeAmount > 0) {
            const shake = this.fearShakeAmount * 0.001;
            this.camera.position.x += (Math.random() - 0.5) * shake;
            this.camera.position.y += (Math.random() - 0.5) * shake;
        }
        
        // Move controls object
        this.controls.moveRight(this.velocity.x);
        this.controls.moveForward(-this.velocity.z);
        
        // Check for interactables
        this.checkInteraction();
    }

    checkInteraction() {
        // Raycast from camera center
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
        
        if (intersects.length > 0) {
            const object = this.getInteractableParent(intersects[0].object);
            if (object && object !== this.currentInteractable) {
                this.currentInteractable = object;
                this.showInteractionPrompt(object);
            }
        } else {
            if (this.currentInteractable) {
                this.currentInteractable = null;
                this.hideInteractionPrompt();
            }
        }
    }

    getInteractableParent(object) {
        // Find the parent object that has interactable data
        let current = object;
        while (current) {
            if (current.userData && current.userData.interactable) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    interact() {
        if (this.currentInteractable) {
            // Dispatch interaction event
            window.dispatchEvent(new CustomEvent('objectInteracted', {
                detail: { object: this.currentInteractable }
            }));
        }
    }

    showInteractionPrompt(object) {
        const objectName = object.userData.name || 'Object';
        // Directly access HUD if available
        if (window.gameHUD) {
            window.gameHUD.showInteractionPrompt(objectName);
        }
    }

    hideInteractionPrompt() {
        // Directly access HUD if available
        if (window.gameHUD) {
            window.gameHUD.hideInteractionPrompt();
        }
    }

    playFootstepSound() {
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'footstep' }
        }));
    }

    addInteractableObject(object) {
        if (!this.interactableObjects.includes(object)) {
            this.interactableObjects.push(object);
        }
    }

    removeInteractableObject(object) {
        const index = this.interactableObjects.indexOf(object);
        if (index > -1) {
            this.interactableObjects.splice(index, 1);
        }
    }

    lock(shouldLock) {
        if (shouldLock && !this.isLocked) {
            this.controls.lock();
        } else if (!shouldLock && this.isLocked) {
            this.controls.unlock();
        }
    }

    setSensitivity(value) {
        this.sensitivity = value;
        // Note: PointerLockControls doesn't expose sensitivity directly
        // Would need to modify the controls or handle mouse movement manually
    }

    setInvertY(value) {
        this.invertY = value;
    }

    setFearLevel(level) {
        this.fearLevel = level;
        
        // Update shake amount based on fear
        if (level <= 50) {
            this.fearShakeAmount = 0;
        } else if (level <= 75) {
            this.fearShakeAmount = 5;
        } else {
            this.fearShakeAmount = 10;
        }
    }

    getPosition() {
        return this.controls.getObject().position;
    }

    setPosition(x, y, z) {
        this.controls.getObject().position.set(x, y, z);
    }

    destroy() {
        this.controls.dispose();
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
}

export default PlayerController;