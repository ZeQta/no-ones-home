/**
 * AudioManager - Comprehensive audio system with spatial audio
 */

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.ambient = {};
        
        this.masterVolume = 0.8;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.85;
        this.ambientVolume = 0.75;
        
        this.currentMusic = null;
        this.currentPhase = 0;
        
        // Audio context for Web Audio API
        this.audioContext = null;
        this.initialized = false;
    }

    async init() {
        console.log('Initializing audio system...');
        
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load sound effects
        this.loadSoundEffects();
        
        // Load music tracks
        this.loadMusicTracks();
        
        // Load ambient sounds
        this.loadAmbientSounds();
        
        this.initialized = true;
        console.log('Audio system initialized');
    }

    loadSoundEffects() {
        // UI Sounds
        this.createSound('buttonHover', this.generateTone(800, 0.1, 'sine'));
        this.createSound('buttonClick', this.generateTone(400, 0.15, 'sine'));
        this.createSound('phoneNotification', this.generateTone(1000, 0.3, 'sine'));
        this.createSound('phoneOpen', this.generateTone(600, 0.2, 'sine'));
        
        // Interaction Sounds
        this.createSound('doorOpen', this.generateNoise(2.0, 0.3));
        this.createSound('doorClose', this.generateNoise(1.5, 0.4));
        this.createSound('doorSlam', this.generateNoise(1.0, 0.8));
        this.createSound('lightSwitch', this.generateTone(200, 0.1, 'square'));
        this.createSound('footstep', this.generateNoise(0.1, 0.2));
        
        // Horror Sounds
        this.createSound('bassDrop', this.generateTone(50, 1.0, 'sine'));
        this.createSound('soundRush', this.generateNoise(1.0, 0.6));
        this.createSound('glassCrash', this.generateNoise(0.8, 0.5));
        this.createSound('tvStatic', this.generateNoise(2.0, 0.4));
        this.createSound('whispers', this.generateNoise(3.0, 0.3));
        this.createSound('shadowPresence', this.generateTone(40, 2.0, 'sine'));
        this.createSound('finalScream', this.generateNoise(1.5, 0.9));
        this.createSound('objectMove', this.generateNoise(0.5, 0.3));
    }

    loadMusicTracks() {
        // Menu music
        this.music.menu = this.generateAmbientDrone(60, 0.4);
        
        // Phase music (all procedurally generated for now)
        this.music.phase1 = this.generateAmbientDrone(120, 0.2);
        this.music.phase2 = this.generateAmbientDrone(100, 0.3);
        this.music.phase3 = this.generateAmbientDrone(80, 0.5);
        this.music.phase4 = this.generateAmbientDrone(60, 0.7);
        this.music.ending = this.generateAmbientDrone(90, 0.4);
    }

    loadAmbientSounds() {
        // Environmental ambience
        this.ambient.clock = this.generateTone(1000, 0.1, 'sine');
        this.ambient.fridge = this.generateTone(50, 0.3, 'sine');
        this.ambient.wind = this.generateNoise(5.0, 0.2);
    }

    // ==================
    // SOUND GENERATION (Procedural for web-based game)
    // ==================

    generateTone(frequency, duration, type = 'sine') {
        // Returns a simple tone configuration
        return {
            type: 'tone',
            frequency: frequency,
            duration: duration,
            waveType: type,
            generated: true
        };
    }

    generateNoise(duration, volume) {
        // Returns noise configuration
        return {
            type: 'noise',
            duration: duration,
            volume: volume,
            generated: true
        };
    }

    generateAmbientDrone(bpm, intensity) {
        return {
            type: 'drone',
            bpm: bpm,
            intensity: intensity,
            generated: true
        };
    }

    createSound(name, config) {
        this.sounds[name] = config;
    }

    // ==================
    // PLAYBACK METHODS
    // ==================

    playSFX(soundName, loop = false, volume = 1.0) {
        if (!this.initialized || !this.sounds[soundName]) {
            console.warn(`Sound not found: ${soundName}`);
            return null;
        }

        const sound = this.sounds[soundName];
        const finalVolume = volume * this.sfxVolume * this.masterVolume;

        if (sound.generated) {
            return this.playGeneratedSound(sound, loop, finalVolume);
        }

        return null;
    }

    playGeneratedSound(soundConfig, loop, volume) {
        if (!this.audioContext) return null;

        const ctx = this.audioContext;
        
        if (soundConfig.type === 'tone') {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.type = soundConfig.waveType;
            oscillator.frequency.setValueAtTime(soundConfig.frequency, ctx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + soundConfig.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + soundConfig.duration);
            
            return { oscillator, gainNode };
            
        } else if (soundConfig.type === 'noise') {
            const bufferSize = ctx.sampleRate * soundConfig.duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const source = ctx.createBufferSource();
            const gainNode = ctx.createGain();
            
            source.buffer = buffer;
            source.loop = loop;
            
            gainNode.gain.setValueAtTime(volume * soundConfig.volume, ctx.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            source.start(ctx.currentTime);
            if (!loop) {
                source.stop(ctx.currentTime + soundConfig.duration);
            }
            
            return { source, gainNode };
        }
        
        return null;
    }

    playMusic(trackName, fadeIn = true) {
        const track = this.music[trackName];
        if (!track) {
            console.warn(`Music track not found: ${trackName}`);
            return;
        }

        // Stop current music
        if (this.currentMusic) {
            this.stopMusic();
        }

        const finalVolume = this.musicVolume * this.masterVolume;
        this.currentMusic = this.playGeneratedSound(track, true, finalVolume);
    }

    stopMusic(fadeOut = true) {
        if (this.currentMusic) {
            if (this.currentMusic.source) {
                this.currentMusic.source.stop();
            }
            if (this.currentMusic.oscillator) {
                this.currentMusic.oscillator.stop();
            }
            this.currentMusic = null;
        }
    }

    transitionToPhase1Music() {
        this.transitionMusic('phase1');
    }

    transitionToPhase2Music() {
        this.transitionMusic('phase2');
    }

    transitionToPhase3Music() {
        this.transitionMusic('phase3');
    }

    transitionToPhase4Music() {
        this.transitionMusic('phase4');
    }

    transitionMusic(trackName) {
        console.log(`Transitioning to music: ${trackName}`);
        // For now, just switch music
        this.playMusic(trackName);
    }

    startAmbient() {
        // Start ambient sounds
        if (this.ambient.fridge) {
            this.playGeneratedSound(this.ambient.fridge, true, 0.3 * this.ambientVolume * this.masterVolume);
        }
        if (this.ambient.wind) {
            this.playGeneratedSound(this.ambient.wind, true, 0.2 * this.ambientVolume * this.masterVolume);
        }
    }

    stopAmbient() {
        // Stop all ambient sounds
    }

    // ==================
    // VOLUME CONTROLS
    // ==================

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
    }

    // ==================
    // PAUSE/RESUME
    // ==================

    pauseAll() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resumeAll() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    stopAll() {
        this.stopMusic();
        this.stopAmbient();
    }

    // ==================
    // UPDATE
    // ==================

    update(deltaTime) {
        // Update any time-based audio effects
    }
}

export default AudioManager;