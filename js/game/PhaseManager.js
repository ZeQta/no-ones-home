/**
 * PhaseManager - Manages game phases and progression
 */

export class PhaseManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentPhase = 0;
        this.phaseStartTime = 0;
        
        // Phase definitions (in minutes)
        this.phases = {
            0: { name: 'Awakening', duration: 3 },
            1: { name: 'Normal Exploration', duration: 4 },
            2: { name: 'Subtle Wrongness', duration: 3 },
            3: { name: 'Psychological Tension', duration: 3 },
            4: { name: 'The Encounter', duration: 4 },
            5: { name: 'The Horror Crescendo', duration: 2 },
            6: { name: 'The Loop', duration: 1 }
        };
        
        this.fearDecayRate = 2; // points per second
    }

    update(deltaTime) {
        const gameTime = this.gameManager.getGameTime();
        const phaseTime = (gameTime - this.phaseStartTime) / 60; // Convert to minutes
        
        // Check for phase transitions
        this.checkPhaseTransition(gameTime);
        
        // Update fear level decay
        this.updateFearDecay(deltaTime);
        
        // Phase-specific updates
        this.updatePhaseEffects(deltaTime);
    }

    checkPhaseTransition(gameTime) {
        const minutesPassed = gameTime / 60;
        
        if (this.currentPhase === 0 && minutesPassed >= 0) {
            // Phase 0: Awakening (handled by StoryManager opening cutscene)
        } else if (this.currentPhase === 1 && minutesPassed >= 3) {
            this.transitionToPhase(2);
        } else if (this.currentPhase === 2 && minutesPassed >= 7) {
            this.transitionToPhase(3);
        } else if (this.currentPhase === 3 && minutesPassed >= 10) {
            this.transitionToPhase(4);
        }
        // Phase 4, 5, 6 are triggered by story events
    }

    transitionToPhase(phaseNumber) {
        if (phaseNumber === this.currentPhase) return;
        
        console.log(`Transitioning to Phase ${phaseNumber}: ${this.phases[phaseNumber].name}`);
        
        this.currentPhase = phaseNumber;
        this.phaseStartTime = this.gameManager.getGameTime();
        
        // Notify other systems
        window.dispatchEvent(new CustomEvent('phaseChanged', {
            detail: { phase: phaseNumber, name: this.phases[phaseNumber].name }
        }));
        
        // Apply phase-specific changes
        this.applyPhaseChanges(phaseNumber);
    }

    applyPhaseChanges(phase) {
        const hud = this.gameManager.hud;
        const audio = this.gameManager.audioManager;
        
        switch(phase) {
            case 1:
                hud.setObjective('Explore the house', 10000);
                audio.transitionToPhase1Music();
                break;
                
            case 2:
                hud.setObjective('Something feels off...', 8000);
                audio.transitionToPhase2Music();
                this.increaseFear(5);
                break;
                
            case 3:
                hud.setObjective('You feel uneasy', 8000);
                audio.transitionToPhase3Music();
                this.increaseFear(15);
                break;
                
            case 4:
                hud.setObjective('Get to safety', 0); // Stay visible
                audio.transitionToPhase4Music();
                break;
                
            case 5:
                hud.setObjective('', 0);
                break;
        }
    }

    updateFearDecay(deltaTime) {
        const hud = this.gameManager.hud;
        const currentFear = hud.getFearLevel();
        
        if (currentFear > 0 && this.currentPhase < 4) {
            const newFear = Math.max(0, currentFear - this.fearDecayRate * deltaTime);
            hud.setFearLevel(newFear);
            this.gameManager.playerController.setFearLevel(newFear);
        }
    }

    updatePhaseEffects(deltaTime) {
        // Phase-specific continuous effects
        switch(this.currentPhase) {
            case 3:
                // Occasionally add subtle fear
                if (Math.random() < 0.01) {
                    this.increaseFear(2);
                }
                break;
                
            case 4:
                // Keep fear high
                const hud = this.gameManager.hud;
                if (hud.getFearLevel() < 50) {
                    hud.setFearLevel(50);
                }
                break;
                
            case 5:
                // Maximum fear
                this.gameManager.hud.setFearLevel(100);
                this.gameManager.playerController.setFearLevel(100);
                break;
        }
    }

    increaseFear(amount) {
        const hud = this.gameManager.hud;
        const currentFear = hud.getFearLevel();
        const newFear = Math.min(100, currentFear + amount);
        hud.setFearLevel(newFear);
        this.gameManager.playerController.setFearLevel(newFear);
    }

    getCurrentPhase() {
        return this.currentPhase;
    }

    getCurrentPhaseName() {
        return this.phases[this.currentPhase].name;
    }
}

export default PhaseManager;