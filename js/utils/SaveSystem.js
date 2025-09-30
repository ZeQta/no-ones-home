/**
 * SaveSystem - Handles game save/load functionality
 */

export class SaveSystem {
    constructor() {
        this.saveKey = 'fearsToFictionSave';
    }

    save(gameState) {
        try {
            const saveData = {
                timestamp: Date.now(),
                gameTime: gameState.gameTime,
                phase: gameState.phase,
                playerPosition: gameState.playerPosition,
                fearLevel: gameState.fearLevel,
                triggeredEvents: gameState.triggeredEvents
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(this.saveKey);
            if (saved) {
                const saveData = JSON.parse(saved);
                console.log('Game loaded successfully');
                return saveData;
            }
            return null;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
        console.log('Save data deleted');
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }
}

export default SaveSystem;