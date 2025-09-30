/**
 * StoryManager - Manages narrative progression and scripted events
 */

import * as THREE from 'three';

export class StoryManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.events = [];
        this.triggeredEvents = new Set();
        this.cutsceneActive = false;
        
        this.objectDisplacements = [];
        this.peripheralSightings = [];
        
        this.setupEvents();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('phaseChanged', (e) => {
            this.onPhaseChanged(e.detail.phase);
        });
        
        window.addEventListener('objectInteracted', (e) => {
            this.onObjectInteracted(e.detail.object);
        });
    }

    setupEvents() {
        // Define all story events with timing
        this.events = [
            // Phase 2 - Object Displacements
            { time: 420, id: 'displacement_book', type: 'displacement', triggered: false },
            { time: 450, id: 'displacement_cup', type: 'displacement', triggered: false },
            { time: 495, id: 'tv_on', type: 'event', triggered: false },
            { time: 540, id: 'closet_open', type: 'displacement', triggered: false },
            { time: 585, id: 'photo_tilt', type: 'displacement', triggered: false },
            { time: 630, id: 'lights_flicker', type: 'event', triggered: false },
            
            // Phase 3 - Whispers and shadows
            { time: 660, id: 'whispers_begin', type: 'event', triggered: false },
            { time: 690, id: 'peripheral_shadow_1', type: 'shadow', triggered: false },
            { time: 720, id: 'peripheral_shadow_2', type: 'shadow', triggered: false },
            { time: 750, id: 'peripheral_shadow_3', type: 'shadow', triggered: false },
            
            // Phase 4 - The Encounter (780 seconds = 13 minutes)
            { time: 780, id: 'hallway_encounter', type: 'cutscene', triggered: false }
        ];
    }

    update(deltaTime) {
        if (this.cutsceneActive) return;
        
        const gameTime = this.gameManager.getGameTime();
        
        // Check for timed events
        this.events.forEach(event => {
            if (!event.triggered && gameTime >= event.time) {
                event.triggered = true;
                this.triggerEvent(event);
            }
        });
    }

    triggerEvent(event) {
        console.log(`Triggering event: ${event.id}`);
        
        switch(event.id) {
            case 'displacement_book':
                this.displacementBookEvent();
                break;
            case 'displacement_cup':
                this.displacementCupEvent();
                break;
            case 'tv_on':
                this.tvTurnsOnEvent();
                break;
            case 'closet_open':
                this.closetOpenEvent();
                break;
            case 'photo_tilt':
                this.photoFallEvent();
                break;
            case 'lights_flicker':
                this.lightsFlickerEvent();
                break;
            case 'whispers_begin':
                this.whispersBeginEvent();
                break;
            case 'peripheral_shadow_1':
            case 'peripheral_shadow_2':
            case 'peripheral_shadow_3':
                this.peripheralShadowEvent();
                break;
            case 'hallway_encounter':
                this.hallwayEncounterCutscene();
                break;
        }
    }

    // ==================
    // CUTSCENES
    // ==================

    playOpeningCutscene() {
        console.log('Playing opening cutscene');
        this.cutsceneActive = true;
        
        const hud = this.gameManager.hud;
        const phoneUI = this.gameManager.phoneUI;
        const player = this.gameManager.playerController;
        
        // Player starts in bed position
        player.setPosition(-11, 1.6, 7);
        player.lock(false);
        
        // Hide HUD initially
        hud.hide();
        
        // Sequence
        setTimeout(() => {
            // Step 1: Play phone notification sound
            window.dispatchEvent(new CustomEvent('playSound', {
                detail: { sound: 'phoneNotification' }
            }));
        }, 1000);
        
        setTimeout(() => {
            // Step 2: Show phone with message
            phoneUI.clearMessages();
            phoneUI.addMessage(
                "All the doors are locked from outside, food is in the fridge, eat fast, I am out for work trip and will be there by morning",
                "6:32 PM"
            );
            phoneUI.open();
        }, 3000);
        
        setTimeout(() => {
            // Step 3: Close phone and give control
            phoneUI.close();
            hud.show();
            hud.showTutorial('Use WASD to move, Mouse to look around', 5000);
            
            setTimeout(() => {
                hud.showTutorial('Press E to interact with objects', 5000);
            }, 5500);
            
            hud.setObjective('Explore the house', 10000);
            
            player.lock(true);
            this.cutsceneActive = false;
            
            // Start Phase 1
            this.gameManager.phaseManager.transitionToPhase(1);
            
        }, 10000);
    }

    hallwayEncounterCutscene() {
        console.log('Playing hallway encounter cutscene');
        this.cutsceneActive = true;
        
        const player = this.gameManager.playerController;
        const hud = this.gameManager.hud;
        const audio = this.gameManager.audioManager;
        
        // Lock player movement
        player.lock(false);
        
        // Stop all ambient sounds
        audio.stopAmbient();
        
        // Spawn shadow figure in hallway
        const shadowFigure = this.gameManager.sceneManager.shadowFigure;
        if (shadowFigure) {
            shadowFigure.show();
            shadowFigure.setPosition([0, 1.1, -5]); // Center of hallway
        }
        
        // Play bass drop
        audio.playSFX('bassDrop');
        
        // Set fear to maximum
        this.gameManager.phaseManager.increaseFear(100);
        
        // After 2.5 seconds, figure vanishes
        setTimeout(() => {
            if (shadowFigure) {
                shadowFigure.hide();
            }
            
            // Sound rushes back
            audio.playSFX('soundRush');
            audio.startAmbient();
            
            // Flicker lights
            this.flickerLightsEffect();
            
            // Screen flash
            this.screenFlash();
            
        }, 2500);
        
        // After 3 seconds, show run prompt
        setTimeout(() => {
            hud.showTutorial('RUN TO YOUR ROOM', 0);
            player.lock(true);
            this.cutsceneActive = false;
            
            // Transition to Phase 4
            this.gameManager.phaseManager.transitionToPhase(4);
            
            // Set up bedroom horror trigger
            this.setupBedroomHorrorTrigger();
            
        }, 3500);
    }

    setupBedroomHorrorTrigger() {
        // Check when player enters bedroom
        const checkBedroom = setInterval(() => {
            const playerPos = this.gameManager.playerController.getPosition();
            
            // If player is in bedroom area
            if (playerPos.x < -9 && playerPos.z > 5) {
                clearInterval(checkBedroom);
                this.bedroomHorrorSequence();
            }
        }, 100);
    }

    bedroomHorrorSequence() {
        console.log('Starting bedroom horror sequence');
        this.cutsceneActive = true;
        
        const player = this.gameManager.playerController;
        const hud = this.gameManager.hud;
        const audio = this.gameManager.audioManager;
        
        hud.hideTutorial();
        
        // Door slams
        audio.playSFX('doorSlam');
        
        // Lock player
        player.lock(false);
        
        setTimeout(() => {
            hud.showTutorial("It won't open...", 3000);
        }, 1000);
        
        // Start flickering lights
        setTimeout(() => {
            this.intenseLightFlicker();
        }, 3000);
        
        // Spawn shadow figure
        setTimeout(() => {
            this.spawnBedroomShadowFigure();
        }, 8000);
        
        // Figure approaches for 30 seconds, then final jump scare
        setTimeout(() => {
            this.finalJumpScare();
        }, 38000);
    }

    spawnBedroomShadowFigure() {
        const shadowFigure = this.gameManager.sceneManager.shadowFigure;
        const audio = this.gameManager.audioManager;
        
        if (!shadowFigure) return;
        
        // Position in corner of bedroom
        shadowFigure.setPosition([-14, 1.1, 3]);
        shadowFigure.fadeIn(2.0);
        shadowFigure.setAppearanceStage(3);
        
        // Play presence sound
        audio.playSFX('shadowPresence', true); // Loop
        
        // Animate towards player slowly
        this.animateShadowFigureApproach(shadowFigure);
    }

    animateShadowFigureApproach(shadowFigure) {
        const playerPos = this.gameManager.playerController.getPosition();
        const duration = 30; // 30 seconds
        
        // Calculate target position near player
        const targetPos = new THREE.Vector3(
            playerPos.x + 1,
            1.1,
            playerPos.z + 1
        );
        
        shadowFigure.moveTo(targetPos, duration);
    }

    finalJumpScare() {
        console.log('Final jump scare!');
        
        const audio = this.gameManager.audioManager;
        const hud = this.gameManager.hud;
        
        // Stop all sounds
        audio.stopAll();
        
        // Brief silence
        setTimeout(() => {
            // Massive jump scare sound
            audio.playSFX('finalScream');
            
            // Screen flash white
            this.screenFlashWhite();
            
            // Hide shadow figure
            const shadowFigure = this.gameManager.sceneManager.shadowFigure;
            if (shadowFigure) {
                shadowFigure.hide();
            }
            
        }, 500);
        
        // Fade to black
        setTimeout(() => {
            this.fadeToBlack();
        }, 1500);
        
        // Start loop ending
        setTimeout(() => {
            this.loopEndingSequence();
        }, 4500);
    }

    loopEndingSequence() {
        console.log('Starting loop ending');
        
        const hud = this.gameManager.hud;
        const phoneUI = this.gameManager.phoneUI;
        const player = this.gameManager.playerController;
        const audio = this.gameManager.audioManager;
        
        // Black screen for 3 seconds (already black)
        
        // Play phone notification again
        setTimeout(() => {
            audio.playSFX('phoneNotification');
        }, 3000);
        
        // Fade from black
        setTimeout(() => {
            this.fadeFromBlack();
            
            // Reset player position
            player.setPosition(-11, 1.6, 7);
            
            // Reset environment
            this.resetEnvironment();
            
        }, 3500);
        
        // Show phone message again
        setTimeout(() => {
            phoneUI.clearMessages();
            phoneUI.addMessage(
                "All the doors are locked from outside, food is in the fridge, eat fast, I am out for work trip and will be there by morning",
                "6:32 PM"
            );
            phoneUI.open();
        }, 5000);
        
        // Show end credits
        setTimeout(() => {
            phoneUI.close();
            this.showEndCredits();
        }, 12000);
    }

    showEndCredits() {
        const endCredits = document.getElementById('end-credits');
        endCredits.classList.remove('hidden');
        
        // Stop game
        this.gameManager.isRunning = false;
        
        // Play ending music
        this.gameManager.audioManager.playMusic('ending');
    }

    // ==================
    // STORY EVENTS
    // ==================

    displacementBookEvent() {
        console.log('Book displacement event');
        // In a full implementation, would actually move a book object
        this.gameManager.phaseManager.increaseFear(5);
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'objectMove' }
        }));
    }

    displacementCupEvent() {
        console.log('Cup displacement event');
        this.gameManager.phaseManager.increaseFear(5);
    }

    tvTurnsOnEvent() {
        console.log('TV turns on event');
        
        // Turn on TV (set emissive)
        const tv = this.gameManager.sceneManager.environment.tv;
        if (tv) {
            tv.material.emissive = new THREE.Color(0x2244ff);
            tv.material.emissiveIntensity = 0.5;
        }
        
        // Play TV static sound
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'tvStatic', loop: true }
        }));
        
        this.gameManager.phaseManager.increaseFear(10);
    }

    closetOpenEvent() {
        console.log('Closet opens by itself');
        this.gameManager.phaseManager.increaseFear(12);
    }

    photoFallEvent() {
        console.log('Photo falls from wall');
        
        // Play crash sound
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'glassCrash' }
        }));
        
        // Camera shake
        this.cameraShake(0.1, 0.5);
        
        this.gameManager.phaseManager.increaseFear(15);
    }

    lightsFlickerEvent() {
        console.log('All lights flicker');
        
        this.flickerAllLights();
        this.gameManager.phaseManager.increaseFear(10);
        
        // Turn off bathroom light
        setTimeout(() => {
            const bathroomLight = this.gameManager.sceneManager.lights.bathroom;
            if (bathroomLight) {
                bathroomLight.intensity = 0;
            }
        }, 2000);
    }

    whispersBeginEvent() {
        console.log('Whispers begin');
        
        // Play whisper sounds
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'whispers', loop: true }
        }));
        
        this.gameManager.phaseManager.increaseFear(15);
        this.gameManager.hud.setObjective('You feel uneasy', 8000);
        
        // Transition to Phase 3
        this.gameManager.phaseManager.transitionToPhase(3);
    }

    peripheralShadowEvent() {
        console.log('Peripheral shadow sighting');
        
        // Brief shadow appearance at edge of screen
        // Would need more complex implementation with actual shadow object
        
        window.dispatchEvent(new CustomEvent('playSound', {
            detail: { sound: 'bassDrop' }
        }));
        
        this.gameManager.phaseManager.increaseFear(25);
    }

    onPhaseChanged(phase) {
        console.log(`Story manager: Phase changed to ${phase}`);
    }

    onObjectInteracted(object) {
        console.log(`Object interacted:`, object.userData.name);
        
        // Handle specific object interactions
        const objectName = object.userData.name;
        
        switch(objectName) {
            case 'bed':
                this.showMessage("You don't want to sleep right now");
                break;
            case 'phone':
                this.gameManager.openPhone();
                break;
            case 'tv':
                this.toggleTV();
                break;
            case 'fridge':
                this.openFridge();
                break;
        }
    }

    // ==================
    // HELPER METHODS
    // ==================

    flickerAllLights() {
        const lights = this.gameManager.sceneManager.lights;
        const originalIntensities = {};
        
        Object.keys(lights).forEach(key => {
            originalIntensities[key] = lights[key].intensity;
        });
        
        let flickerCount = 0;
        const flickerInterval = setInterval(() => {
            Object.keys(lights).forEach(key => {
                lights[key].intensity = Math.random() > 0.5 ? originalIntensities[key] : 0;
            });
            
            flickerCount++;
            if (flickerCount > 10) {
                clearInterval(flickerInterval);
                // Restore lights
                Object.keys(lights).forEach(key => {
                    lights[key].intensity = originalIntensities[key];
                });
            }
        }, 100);
    }

    flickerLightsEffect() {
        this.flickerAllLights();
    }

    intenseLightFlicker() {
        const lights = this.gameManager.sceneManager.lights;
        
        const flickerInterval = setInterval(() => {
            Object.keys(lights).forEach(key => {
                lights[key].intensity = Math.random();
            });
        }, 50);
        
        // Stop after 30 seconds
        setTimeout(() => {
            clearInterval(flickerInterval);
        }, 30000);
    }

    cameraShake(amount, duration) {
        const camera = this.gameManager.camera;
        const originalPos = camera.position.clone();
        
        const startTime = Date.now();
        const shakeInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed > duration) {
                clearInterval(shakeInterval);
                camera.position.copy(originalPos);
                return;
            }
            
            camera.position.x = originalPos.x + (Math.random() - 0.5) * amount;
            camera.position.y = originalPos.y + (Math.random() - 0.5) * amount;
            camera.position.z = originalPos.z + (Math.random() - 0.5) * amount;
        }, 16);
    }

    screenFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '1';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = 'opacity 0.3s';
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 100);
    }

    screenFlashWhite() {
        this.screenFlash();
    }

    fadeToBlack() {
        const overlay = document.createElement('div');
        overlay.id = 'fade-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '9998';
        overlay.style.transition = 'opacity 2s';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);
    }

    fadeFromBlack() {
        const overlay = document.getElementById('fade-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 2000);
        }
    }

    resetEnvironment() {
        // Reset all objects to original positions
        // Reset lights
        const lights = this.gameManager.sceneManager.lights;
        lights.bedroom.intensity = 1;
        lights.livingRoom.intensity = 1.2;
        lights.kitchen.intensity = 1.0;
        lights.bathroom.intensity = 1.0;
        
        // Turn off TV
        const tv = this.gameManager.sceneManager.environment.tv;
        if (tv) {
            tv.material.emissive = new THREE.Color(0x000000);
            tv.material.emissiveIntensity = 0;
        }
    }

    showMessage(text) {
        this.gameManager.hud.showTutorial(text, 3000);
    }

    toggleTV() {
        const tv = this.gameManager.sceneManager.environment.tv;
        if (!tv) return;
        
        if (tv.material.emissiveIntensity > 0) {
            // Turn off
            tv.material.emissive = new THREE.Color(0x000000);
            tv.material.emissiveIntensity = 0;
        } else {
            // Turn on
            tv.material.emissive = new THREE.Color(0x2244ff);
            tv.material.emissiveIntensity = 0.5;
        }
    }

    openFridge() {
        this.showMessage('Food in the fridge. Not very hungry right now.');
    }
}

export default StoryManager;