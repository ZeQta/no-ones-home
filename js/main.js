/**
 * FEARS TO FICTION - Episode 1: No One's Home
 * Main Entry Point
 */

import { GameManager } from './game/GameManager.js';
import { MenuUI } from './ui/MenuUI.js';
import { SettingsUI } from './ui/SettingsUI.js';
import { ErrorHandler } from './utils/ErrorHandler.js';

class Main {
    constructor() {
        this.gameManager = null;
        this.menuUI = null;
        this.settingsUI = null;
        this.errorHandler = null;
        
        this.init();
    }

    init() {
        // Initialize error handler
        this.errorHandler = new ErrorHandler();
        
        // Check browser compatibility
        const issues = this.errorHandler.checkCompatibility();
        if (issues.length > 0) {
            console.warn('Compatibility issues detected:', issues);
        }
        
        // Initialize UI systems
        this.menuUI = new MenuUI();
        this.settingsUI = new SettingsUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 1000);
        
        console.log('%c🎮 Fears to Fiction - Episode 1: No One\'s Home', 'color: #ff4444; font-size: 20px; font-weight: bold;');
        console.log('%cGame initialized successfully', 'color: #4a90e2; font-size: 14px;');
    }

    setupEventListeners() {
        // Start game button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.settingsUI.show();
        });

        // Credits button
        document.getElementById('credits-btn').addEventListener('click', () => {
            document.getElementById('credits-menu').classList.remove('hidden');
        });

        // Credits close
        document.getElementById('credits-close').addEventListener('click', () => {
            document.getElementById('credits-menu').classList.add('hidden');
        });

        // Settings close
        document.getElementById('settings-close').addEventListener('click', () => {
            this.settingsUI.hide();
        });

        // Pause menu handlers
        document.getElementById('resume-btn').addEventListener('click', () => {
            if (this.gameManager) {
                this.gameManager.togglePause();
            }
        });

        document.getElementById('pause-settings-btn').addEventListener('click', () => {
            this.settingsUI.show();
        });

        document.getElementById('quit-btn').addEventListener('click', () => {
            this.quitToMenu();
        });

        // ESC key for pause
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameManager && this.gameManager.isRunning) {
                this.gameManager.togglePause();
            }
        });
    }

    async startGame() {
        // Hide main menu
        this.menuUI.hide();
        
        // Show loading
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        document.getElementById('loading-text').textContent = 'Loading game...';
        
        try {
            // Initialize game manager
            this.gameManager = new GameManager();
            await this.gameManager.init();
            
            // Update loading
            document.getElementById('loading-text').textContent = 'Starting episode...';
            
            // Start the game
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.gameManager.start();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to load game. Please refresh and try again.');
            loadingScreen.style.display = 'none';
            this.menuUI.show();
        }
    }

    quitToMenu() {
        if (this.gameManager) {
            this.gameManager.destroy();
            this.gameManager = null;
        }
        
        // Hide pause menu
        document.getElementById('pause-menu').classList.add('hidden');
        
        // Hide HUD
        document.getElementById('game-hud').classList.add('hidden');
        
        // Show main menu
        this.menuUI.show();
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Main();
    });
} else {
    new Main();
}

export default Main;