/**
 * SettingsUI - Manages game settings interface
 */

export class SettingsUI {
    constructor() {
        this.settingsElement = document.getElementById('settings-menu');
        this.settings = this.loadSettings();
        
        this.init();
    }

    init() {
        // Apply loaded settings to UI
        this.applySettingsToUI();
        
        // Set up event listeners for settings changes
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Quality
        document.getElementById('quality-select').addEventListener('change', (e) => {
            this.settings.quality = e.target.value;
            this.saveSettings();
        });

        // Shadow quality
        document.getElementById('shadow-select').addEventListener('change', (e) => {
            this.settings.shadowQuality = e.target.value;
            this.saveSettings();
        });

        // Post-processing
        document.getElementById('postfx-toggle').addEventListener('change', (e) => {
            this.settings.postProcessing = e.target.checked;
            this.saveSettings();
        });

        // Volume sliders
        const volumeSliders = [
            { id: 'master-volume', key: 'masterVolume', displayId: 'master-value' },
            { id: 'music-volume', key: 'musicVolume', displayId: 'music-value' },
            { id: 'sfx-volume', key: 'sfxVolume', displayId: 'sfx-value' },
            { id: 'ambient-volume', key: 'ambientVolume', displayId: 'ambient-value' }
        ];

        volumeSliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const display = document.getElementById(slider.displayId);
            
            element.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.settings[slider.key] = value;
                display.textContent = value + '%';
                this.saveSettings();
            });
        });

        // Mouse sensitivity
        const sensSlider = document.getElementById('mouse-sens');
        const sensDisplay = document.getElementById('sens-value');
        
        sensSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.settings.mouseSensitivity = value;
            sensDisplay.textContent = value.toFixed(1);
            this.saveSettings();
        });

        // Invert Y
        document.getElementById('invert-y').addEventListener('change', (e) => {
            this.settings.invertY = e.target.checked;
            this.saveSettings();
        });
    }

    applySettingsToUI() {
        document.getElementById('quality-select').value = this.settings.quality;
        document.getElementById('shadow-select').value = this.settings.shadowQuality;
        document.getElementById('postfx-toggle').checked = this.settings.postProcessing;
        
        document.getElementById('master-volume').value = this.settings.masterVolume;
        document.getElementById('master-value').textContent = this.settings.masterVolume + '%';
        
        document.getElementById('music-volume').value = this.settings.musicVolume;
        document.getElementById('music-value').textContent = this.settings.musicVolume + '%';
        
        document.getElementById('sfx-volume').value = this.settings.sfxVolume;
        document.getElementById('sfx-value').textContent = this.settings.sfxVolume + '%';
        
        document.getElementById('ambient-volume').value = this.settings.ambientVolume;
        document.getElementById('ambient-value').textContent = this.settings.ambientVolume + '%';
        
        document.getElementById('mouse-sens').value = this.settings.mouseSensitivity;
        document.getElementById('sens-value').textContent = this.settings.mouseSensitivity.toFixed(1);
        
        document.getElementById('invert-y').checked = this.settings.invertY;
    }

    show() {
        this.settingsElement.classList.remove('hidden');
    }

    hide() {
        this.settingsElement.classList.add('hidden');
    }

    loadSettings() {
        const defaultSettings = {
            quality: 'high',
            shadowQuality: 'medium',
            postProcessing: true,
            masterVolume: 80,
            musicVolume: 70,
            sfxVolume: 85,
            ambientVolume: 75,
            mouseSensitivity: 1.0,
            invertY: false
        };

        const saved = localStorage.getItem('fearsToFictionSettings');
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                return defaultSettings;
            }
        }
        
        return defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('fearsToFictionSettings', JSON.stringify(this.settings));
        
        // Dispatch event for game to update settings
        window.dispatchEvent(new CustomEvent('settingsChanged', { 
            detail: this.settings 
        }));
    }

    getSettings() {
        return this.settings;
    }
}

export default SettingsUI;