# Fears to Fiction - Episode 1: No One's Home

A production-grade psychological horror game built with Three.js, inspired by the Fears to Fathom series.

## 🎮 Game Overview

**Genre:** First-Person Psychological Horror  
**Platform:** Web-based (Three.js)  
**Duration:** 15-20 minutes gameplay  
**Style:** Realistic psychological horror with subtle scares building to intense climax

## 🎯 Features

### Core Gameplay
- **First-person exploration** with realistic movement and head-bob
- **Interactive environment** with multiple interactable objects
- **Dynamic fear system** affecting visuals and gameplay
- **Procedural audio** with spatial 3D sound
- **Multiple game phases** with escalating horror intensity
- **Psychological horror** focusing on atmosphere over jump scares

### Technical Features
- Built with **Three.js** for 3D rendering
- **PointerLock API** for immersive first-person controls
- **Web Audio API** for procedural sound generation
- **TWEEN.js** for smooth animations
- **Modular architecture** with separation of concerns
- **Responsive UI** with settings persistence

### Horror Mechanics
- **Object displacement** - items move when you're not looking
- **Environmental corruption** - subtle changes to familiar spaces
- **Shadow Figure entity** - slowly stalking antagonist
- **Fear/sanity system** - visual effects intensify with fear
- **Scripted events** - carefully timed scares
- **Loop ending** - psychological twist finale

## 📁 Project Structure

```
fears-to-fiction/
├── index.html              # Main HTML entry point
├── css/
│   └── style.css          # Complete UI styling
├── js/
│   ├── main.js            # Application entry point
│   ├── game/
│   │   ├── GameManager.js       # Core game loop
│   │   ├── SceneManager.js      # Three.js scene & rendering
│   │   ├── PlayerController.js  # First-person controls
│   │   ├── StoryManager.js      # Narrative & events
│   │   └── PhaseManager.js      # Game phase progression
│   ├── entities/
│   │   ├── InteractableObject.js  # Base interactable class
│   │   └── ShadowFigure.js        # Antagonist entity
│   ├── ui/
│   │   ├── MenuUI.js     # Main menu
│   │   ├── HUD.js        # In-game HUD
│   │   ├── PhoneUI.js    # Phone interface
│   │   └── SettingsUI.js # Settings menu
│   ├── audio/
│   │   └── AudioManager.js  # Audio system
│   └── utils/
│       ├── AssetLoader.js   # Asset loading
│       └── SaveSystem.js    # Save/load system
└── README.md
```

## 🎮 Controls

- **WASD** - Movement
- **Mouse** - Look around
- **Shift** - Sprint
- **E** - Interact with objects
- **P** - Open phone
- **ESC** - Pause menu

## 🎬 Story Structure

### Act 1: The Awakening (0-3 min)
Player wakes up to mother's text message saying she's away. House is locked. Exploration begins.

### Act 2: Exploration & Unease (3-13 min)
- **Phase 1:** Normal exploration of the house
- **Phase 2:** Objects start moving, subtle wrongness
- **Phase 3:** Psychological tension escalates, whispers begin

### Act 3: The Encounter (13-17 min)
Direct confrontation with the Shadow Figure in the hallway. Player must run to bedroom.

### Act 4: The Horror Crescendo (17-19 min)
Trapped in bedroom as Shadow Figure slowly approaches. Multiple environmental effects.

### Act 5: The Loop (19-20 min)
Everything resets. Same message, same time. The cycle continues.

## 🎨 Visual Design

### Color Palette
- **Background:** Deep blacks (#0a0a0a)
- **UI Elements:** Dark panels (#1a1a1a)
- **Accents:** Danger red (#ff4444)
- **Horror Tint:** Blue overlay (#1a3a52)
- **Shadow Figure:** Pure black with purple glow (#2d1b4e)

### Post-Processing
- Vignette effect based on fear level
- Film grain overlay
- Motion blur during high fear
- Screen shake during intense moments
- Color desaturation as fear increases

## 🔊 Audio Design

### Categories
1. **UI Sounds** - Button clicks, phone notifications
2. **Environmental** - Clock ticking, fridge humming, wind
3. **Interaction** - Doors, lights, footsteps
4. **Horror** - Bass drops, whispers, static, screams
5. **Music** - Ambient drones that evolve with each phase

### Spatial Audio
- 3D positional audio for immersion
- Distance-based volume falloff
- Room-specific reverb settings
- Dynamic mixing based on priority

## ⚙️ Settings

### Graphics
- Quality presets (Low/Medium/High/Ultra)
- Shadow quality control
- Post-processing toggle

### Audio
- Master volume
- Music volume
- SFX volume
- Ambient volume

### Controls
- Mouse sensitivity adjustment
- Y-axis inversion
- Key binding display

## 🚀 How to Run

1. **Local Server Required** (due to ES6 modules)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

2. **Open in Browser**
   ```
   http://localhost:8000
   ```

3. **Recommended Browsers**
   - Chrome/Edge (best performance)
   - Firefox
   - Safari (may have limited audio support)

4. **Hardware Requirements**
   - Modern GPU with WebGL support
   - 4GB RAM minimum
   - Headphones strongly recommended

## 🎓 Technical Implementation

### Architecture Highlights

**Modular Design:** Each system is self-contained with clear interfaces

**Event-Driven:** Custom events for inter-system communication

**Performance:** 
- Efficient render loop
- Object pooling for particles
- LOD system for complex objects
- Shadow map optimization

**Procedural Generation:**
- All audio generated in-browser using Web Audio API
- No external audio files required
- Dynamic music based on game state

### Key Classes

**GameManager** - Orchestrates all systems, main game loop

**SceneManager** - Three.js scene setup, lighting, environment building

**PlayerController** - First-person movement, interaction raycasting

**StoryManager** - Narrative progression, cutscenes, scripted events

**PhaseManager** - Game phase transitions, fear system

**AudioManager** - Procedural audio generation, spatial sound

**ShadowFigure** - Antagonist behavior, animations, spawning

## 🎯 Design Philosophy

### Psychological Horror Over Gore
- Builds tension slowly
- Uses subtle environmental changes
- Exploits player expectations
- Creates sense of isolation and helplessness

### Player Agency
- Freedom to explore at own pace (initially)
- Choices matter (which rooms to visit)
- No hand-holding
- Discovery-based storytelling

### Atmosphere First
- Detailed environment design
- Realistic lighting and shadows
- Subtle audio cues
- Minimal UI for immersion

## 🐛 Known Limitations

- Audio is procedurally generated (not pre-recorded)
- Some 3D models are simple geometric shapes
- No save/load functionality (single session)
- Requires modern browser with WebGL 2.0

## 📝 Credits

**Development:** AI Agent  
**Engine:** Three.js  
**Audio:** Web Audio API  
**Inspiration:** Fears to Fathom series  

## 📜 License

This is a demonstration project created for educational purposes.

---

**⚠️ Warning:** Contains psychological horror elements. Not recommended for those sensitive to scary content. Headphones strongly recommended for full experience.