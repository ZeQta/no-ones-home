/**
 * HUD - In-game heads-up display management
 */

export class HUD {
    constructor() {
        this.hudElement = document.getElementById('game-hud');
        this.objectiveHint = document.getElementById('objective-hint');
        this.interactionPrompt = document.getElementById('interaction-prompt');
        this.fearVignette = document.getElementById('fear-vignette');
        this.tutorialPrompt = document.getElementById('tutorial-prompt');
        
        this.objectiveTimeout = null;
        this.currentFearLevel = 0;
    }

    show() {
        this.hudElement.classList.remove('hidden');
    }

    hide() {
        this.hudElement.classList.add('hidden');
    }

    setObjective(text, duration = 10000) {
        this.objectiveHint.textContent = text;
        this.objectiveHint.style.opacity = '1';
        
        // Clear existing timeout
        if (this.objectiveTimeout) {
            clearTimeout(this.objectiveTimeout);
        }
        
        // Auto-hide after duration
        if (duration > 0) {
            this.objectiveTimeout = setTimeout(() => {
                this.objectiveHint.style.opacity = '0';
            }, duration);
        }
    }

    showInteractionPrompt(objectName) {
        this.interactionPrompt.textContent = `[E] Interact with ${objectName}`;
        this.interactionPrompt.classList.remove('hidden');
    }

    hideInteractionPrompt() {
        this.interactionPrompt.classList.add('hidden');
    }

    setFearLevel(level) {
        // level is 0-100
        this.currentFearLevel = Math.max(0, Math.min(100, level));
        
        // Update vignette opacity based on fear level
        let opacity = 0;
        
        if (this.currentFearLevel <= 25) {
            opacity = 0;
        } else if (this.currentFearLevel <= 50) {
            opacity = 0.15;
        } else if (this.currentFearLevel <= 75) {
            opacity = 0.30;
        } else {
            opacity = 0.45;
        }
        
        this.fearVignette.style.opacity = opacity;
        
        // Add red tint for higher fear levels
        if (this.currentFearLevel > 50) {
            const tintOpacity = (this.currentFearLevel - 50) / 50 * 0.25;
            this.fearVignette.style.background = `radial-gradient(circle, transparent 0%, rgba(139, 0, 0, 0) 40%, rgba(139, 0, 0, ${tintOpacity}) 100%)`;
        } else {
            this.fearVignette.style.background = `radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.5) 100%)`;
        }
    }

    showTutorial(text, duration = 5000) {
        this.tutorialPrompt.textContent = text;
        this.tutorialPrompt.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.tutorialPrompt.classList.add('hidden');
            }, duration);
        }
    }

    hideTutorial() {
        this.tutorialPrompt.classList.add('hidden');
    }

    getFearLevel() {
        return this.currentFearLevel;
    }
}

export default HUD;