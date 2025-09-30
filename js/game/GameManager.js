/**
 * GameManager - Core game loop and system coordination
 */

import { SceneManager } from './SceneManager.js';
import { PlayerController } from './PlayerController.js';
import { StoryManager } from './StoryManager.js';
import { PhaseManager } from './PhaseManager.js';
import { AudioManager } from '../audio/AudioManager.js';
import { HUD } from '../ui/HUD.js';
import { PhoneUI } from '../ui/PhoneUI.js';

export class GameManager {
    constructor() {
        this.sceneManager = null;
        this.playerController = null;
        this.storyManager = null;
        this.phaseManager = null;
        this.audioManager = null;
        this.hud = null;
        this.phoneUI = null;
        
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        
        this.clock = new THREE.Clock();
    }

    async init() {
        console.log('Initializing game systems...');
        
        // Initialize UI
        this.hud = new HUD();
        this.phoneUI = new PhoneUI();
        
        // Make HUD globally accessible for PlayerController
        window.gameHUD = this.hud;
        
        // Initialize audio system
        this.audioManager = new AudioManager();
        await this.audioManager.init();
        
        // Initialize scene and rendering
        this.sceneManager = new SceneManager();
        await this.sceneManager.init();
        
        // Initialize player controller
        this.playerController = new PlayerController(
            this.sceneManager.camera,
            this.sceneManager.scene,
            this.sceneManager.renderer.domElement
        );
        await this.playerController.init();
        
        // Initialize story and phase managers
        this.phaseManager = new PhaseManager(this);
        this.storyManager = new StoryManager(this);
        
        // Register interactable objects with player controller
        const interactables = this.sceneManager.getInteractables();
        interactables.forEach(obj => {
            this.playerController.addInteractableObject(obj);
        });
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Game systems initialized successfully');
    }

    setupEventListeners() {
        // Phone key (P)
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'p' || e.key === 'P') && this.isRunning && !this.isPaused) {
                if (!this.phoneUI.isOpen) {
                    this.openPhone();
                }
            }
        });
        
        // Settings changed
        window.addEventListener('settingsChanged', (e) => {
            this.applySettings(e.detail);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.sceneManager.onWindowResize();
        });
    }

    start() {
        console.log('Starting game...');
        
        this.isRunning = true;
        this.isPaused = false;
        
        // Show HUD
        this.hud.show();
        
        // Start with opening cutscene
        this.storyManager.playOpeningCutscene();
        
        // Start game loop
        this.clock.start();
        this.lastTime = this.clock.getElapsedTime();
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.isPaused) return;
        
        // Calculate delta time
        const currentTime = this.clock.getElapsedTime();
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.gameTime += this.deltaTime;
        
        // Update systems
        this.update(this.deltaTime);
        this.render();
    }

    update(deltaTime) {
        // Update player
        if (this.playerController) {
            this.playerController.update(deltaTime);
        }
        
        // Update story progression
        if (this.storyManager) {
            this.storyManager.update(deltaTime);
        }
        
        // Update phase
        if (this.phaseManager) {
            this.phaseManager.update(deltaTime);
        }
        
        // Update audio
        if (this.audioManager) {
            this.audioManager.update(deltaTime);
        }
        
        // Update scene
        if (this.sceneManager) {
            this.sceneManager.update(deltaTime);
        }
        
        // Update TWEEN animations
        if (window.TWEEN) {
            window.TWEEN.update();
        }
    }

    render() {
        if (this.sceneManager) {
            this.sceneManager.render();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        const pauseMenu = document.getElementById('pause-menu');
        
        if (this.isPaused) {
            pauseMenu.classList.remove('hidden');
            this.playerController.lock(false);
            this.audioManager.pauseAll();
        } else {
            pauseMenu.classList.add('hidden');
            this.playerController.lock(true);
            this.audioManager.resumeAll();
        }
    }

    openPhone() {
        this.phoneUI.open();
        this.playerController.lock(false);
        
        this.phoneUI.setOnClose(() => {
            if (this.isRunning && !this.isPaused) {
                this.playerController.lock(true);
            }
        });
    }

    applySettings(settings) {
        // Apply audio settings
        if (this.audioManager) {
            this.audioManager.setMasterVolume(settings.masterVolume / 100);
            this.audioManager.setMusicVolume(settings.musicVolume / 100);
            this.audioManager.setSFXVolume(settings.sfxVolume / 100);
            this.audioManager.setAmbientVolume(settings.ambientVolume / 100);
        }
        
        // Apply graphics settings
        if (this.sceneManager) {
            this.sceneManager.applyQualitySettings(settings);
        }
        
        // Apply control settings
        if (this.playerController) {
            this.playerController.setSensitivity(settings.mouseSensitivity);
            this.playerController.setInvertY(settings.invertY);
        }
    }

    getGameTime() {
        return this.gameTime;
    }

    getGameTimeFormatted() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    destroy() {
        console.log('Destroying game...');
        
        this.isRunning = false;
        
        // Clean up systems
        if (this.playerController) {
            this.playerController.destroy();
        }
        
        if (this.audioManager) {
            this.audioManager.stopAll();
        }
        
        if (this.sceneManager) {
            this.sceneManager.destroy();
        }
        
        if (this.hud) {
            this.hud.hide();
        }
        
        console.log('Game destroyed');
    }
}

export default GameManager;