# Developer Documentation - Fears to Fiction

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Main Application              │
│         (main.js - Entry)               │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    │   GameManager     │  ← Core coordinator
    │  (Game Loop)      │
    └─────────┬─────────┘
              │
    ┌─────────┴──────────────────────┐
    │                                 │
┌───▼────────┐  ┌──────────┐  ┌─────▼──────┐
│SceneManager│  │  Story   │  │   Phase    │
│(Three.js)  │  │ Manager  │  │  Manager   │
└─────┬──────┘  └────┬─────┘  └─────┬──────┘
      │              │              │
┌─────▼──────┐  ┌────▼─────┐  ┌─────▼──────┐
│  Player    │  │  Audio   │  │    HUD     │
│Controller  │  │ Manager  │  │   & UI     │
└────────────┘  └──────────┘  └────────────┘
```

### System Responsibilities

**GameManager**
- Main game loop (update/render)
- System initialization
- Pause/resume logic
- Settings application

**SceneManager**
- Three.js scene setup
- Lighting system
- Environment building
- 3D object management

**PlayerController**
- First-person movement
- Interaction raycasting
- Input handling
- Camera control

**StoryManager**
- Narrative progression
- Cutscene orchestration
- Event triggering
- Object interactions

**PhaseManager**
- Game phase transitions
- Fear level management
- Timed events
- Difficulty scaling

**AudioManager**
- Procedural audio generation
- Spatial audio
- Volume control
- Music transitions

---

## 📂 File Structure Deep Dive

### Core Files

#### `js/main.js`
- Application entry point
- Initializes all systems
- Sets up global event handlers
- Error handling initialization

#### `js/game/GameManager.js`
- **Purpose:** Central game coordinator
- **Key Methods:**
  - `init()` - Initialize all systems
  - `start()` - Begin game loop
  - `update(deltaTime)` - Update all systems
  - `render()` - Render frame
  - `togglePause()` - Pause/resume
  - `destroy()` - Cleanup

#### `js/game/SceneManager.js`
- **Purpose:** Three.js scene management
- **Key Methods:**
  - `init()` - Setup scene, camera, renderer
  - `setupLighting()` - Create light sources
  - `buildEnvironment()` - Build house geometry
  - `setupInteractables()` - Register interactive objects
  - `update(deltaTime)` - Update scene objects

#### `js/game/PlayerController.js`
- **Purpose:** First-person player control
- **Key Properties:**
  - `walkSpeed` - Normal movement speed
  - `sprintSpeed` - Sprint movement speed
  - `raycaster` - Interaction detection
  - `fearLevel` - Current fear state
- **Key Methods:**
  - `update(deltaTime)` - Movement and interaction check
  - `checkInteraction()` - Raycast for interactables
  - `interact()` - Trigger interaction
  - `setFearLevel(level)` - Update fear effects

#### `js/game/StoryManager.js`
- **Purpose:** Narrative and event orchestration
- **Key Methods:**
  - `playOpeningCutscene()` - Game intro
  - `hallwayEncounterCutscene()` - Shadow figure reveal
  - `bedroomHorrorSequence()` - Final horror scene
  - `loopEndingSequence()` - Loop ending
  - `triggerEvent(event)` - Execute story event

#### `js/game/PhaseManager.js`
- **Purpose:** Game progression and difficulty
- **Phases:**
  - 0: Awakening (0-3 min)
  - 1: Normal Exploration (3-7 min)
  - 2: Subtle Wrongness (7-10 min)
  - 3: Psychological Tension (10-13 min)
  - 4: The Encounter (13-17 min)
  - 5: Horror Crescendo (17-19 min)
  - 6: The Loop (19-20 min)

---

## 🎨 Three.js Implementation

### Scene Setup

```javascript
// Scene configuration
scene.background = new THREE.Color(0x2b3a67); // Evening sky
scene.fog = new THREE.Fog(0x1a1f3a, 10, 50);   // Atmospheric fog

// Camera settings
camera.fov = 75;           // Field of view
camera.near = 0.1;         // Near clipping
camera.far = 1000;         // Far clipping
camera.position.y = 1.6;   // Child height
```

### Lighting Strategy

1. **Ambient Light** - Base illumination (0.3 intensity)
2. **Directional Light** - Sky/window light
3. **Point Lights** - Room-specific lighting
   - Bedroom: Warm (3000K)
   - Living Room: Warm (3000K)
   - Kitchen: Cool white (4000K)
   - Bathroom: Bright white (4000K)

### Material Properties

```javascript
// Realistic materials
{
  color: baseColor,
  roughness: 0.4-0.9,      // Surface roughness
  metalness: 0.0-0.8,      // Metallic properties
  emissive: glowColor,     // Self-illumination
  emissiveIntensity: 0-1   // Glow strength
}
```

---

## 🔊 Audio System

### Procedural Generation

All audio is generated in real-time using Web Audio API:

**Tone Generation:**
```javascript
oscillator.type = 'sine' | 'square' | 'triangle' | 'sawtooth';
oscillator.frequency.value = frequency; // Hz
gainNode.gain.value = volume;
```

**Noise Generation:**
```javascript
// White noise buffer
for (let i = 0; i < bufferSize; i++) {
  buffer[i] = Math.random() * 2 - 1;
}
```

**Spatial Audio:**
```javascript
// 3D positioning
source.setPosition(x, y, z);
source.setOrientation(frontX, frontY, frontZ);
source.refDistance = 5;      // Reference distance
source.maxDistance = 25;     // Max audible distance
source.rolloffFactor = 1.5;  // Volume falloff
```

---

## 🎮 Gameplay Systems

### Fear System

**Fear Levels:**
- 0-25: Calm (no effects)
- 26-50: Uneasy (15% vignette)
- 51-75: Nervous (30% vignette, heartbeat)
- 76-100: Terrified (45% vignette, heavy shake)

**Fear Modifiers:**
- Base decay: -2 points/second
- In lit areas: -3 points/second
- Object displacement: +5 points
- Strange sound: +8 points
- Light flicker: +10 points
- Shadow sighting: +25 points
- Direct encounter: +50 points

### Interaction System

**Raycasting:**
```javascript
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
raycaster.far = 1.5; // Interaction range
const intersects = raycaster.intersectObjects(interactables);
```

**Object Types:**
- `examine` - Display message
- `toggle` - On/off state
- `open` - Door/container
- `pickup` - Inventory item

---

## 🎬 Cutscene System

### Cutscene Structure

1. **Lock player control** - `player.lock(false)`
2. **Set cutscene flag** - `cutsceneActive = true`
3. **Execute sequence** - setTimeout chains
4. **Restore control** - `player.lock(true)`
5. **Clear flag** - `cutsceneActive = false`

### Example Cutscene:

```javascript
cutsceneActive = true;
player.lock(false);

setTimeout(() => {
  // Step 1
  audio.playSFX('sound1');
}, 1000);

setTimeout(() => {
  // Step 2
  showMessage('Message');
}, 3000);

setTimeout(() => {
  // Step 3 - restore control
  player.lock(true);
  cutsceneActive = false;
}, 5000);
```

---

## 🔧 Configuration

### Game Constants

```javascript
// Movement
WALK_SPEED = 3.5;
SPRINT_SPEED = 5.5;
CAMERA_HEIGHT = 1.6;

// Interaction
INTERACT_RANGE = 1.5;
RAYCAST_DISTANCE = 1.5;

// Fear
FEAR_DECAY_RATE = 2.0; // per second
MAX_FEAR = 100;

// Timing (seconds)
PHASE_1_START = 180;   // 3 minutes
PHASE_2_START = 420;   // 7 minutes
PHASE_3_START = 600;   // 10 minutes
PHASE_4_START = 780;   // 13 minutes
```

---

## 🐛 Debugging

### Console Commands

Access via browser console:

```javascript
// Get game manager
window.gameManager

// Force phase transition
window.gameManager.phaseManager.transitionToPhase(3);

// Set fear level
window.gameManager.hud.setFearLevel(75);

// Teleport player
window.gameManager.playerController.setPosition(x, y, z);

// Trigger event
window.gameManager.storyManager.triggerEvent(event);
```

### Debug Mode

Enable detailed logging:

```javascript
localStorage.setItem('debugMode', 'true');
// Reload page
```

---

## 🚀 Performance Optimization

### Best Practices

1. **Object Pooling** - Reuse objects instead of creating new ones
2. **LOD System** - Lower detail for distant objects
3. **Shadow Map Size** - Balance quality vs performance
4. **Texture Compression** - Use compressed formats
5. **Batch Rendering** - Combine similar meshes
6. **Culling** - Don't render what's not visible

### Performance Targets

- **60 FPS** on mid-range hardware
- **30 FPS minimum** on low-end
- **< 500ms** load time
- **< 100ms** interaction response

---

## 🧪 Testing Checklist

### Functional Testing

- [ ] Game loads without errors
- [ ] Main menu buttons work
- [ ] Settings persist
- [ ] Player can move and look
- [ ] Interactions work (press E)
- [ ] Phone opens (press P)
- [ ] Pause works (press ESC)
- [ ] Audio plays correctly
- [ ] Fear system triggers
- [ ] All cutscenes play
- [ ] Game ends properly

### Browser Testing

- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari (limited audio)
- [ ] Mobile browsers (not optimized)

### Performance Testing

- [ ] Maintains 60 FPS on target hardware
- [ ] No memory leaks (check DevTools)
- [ ] Audio doesn't crackle or distort
- [ ] No visual glitches

---

## 📝 Adding New Features

### Adding a New Interactable Object

1. **Create the mesh in SceneManager:**
```javascript
const object = new THREE.Mesh(geometry, material);
this.scene.add(object);
this.environment.objectName = object;
```

2. **Register as interactable:**
```javascript
const interactable = new InteractableObject(
  object, 
  'Display Name', 
  'interact_type'
);
this.interactables.push(interactable);
```

3. **Handle interaction in StoryManager:**
```javascript
onObjectInteracted(object) {
  if (object.userData.name === 'Display Name') {
    // Do something
  }
}
```

### Adding a New Story Event

1. **Add event to StoryManager.setupEvents():**
```javascript
{
  time: 300,              // 5 minutes
  id: 'my_event',
  type: 'event',
  triggered: false
}
```

2. **Create handler method:**
```javascript
myEventMethod() {
  console.log('Event triggered');
  // Event logic here
}
```

3. **Add to triggerEvent() switch:**
```javascript
case 'my_event':
  this.myEventMethod();
  break;
```

---

## 🎓 Learning Resources

### Three.js
- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/

### Web Audio API
- MDN Guide: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Game Design
- "The Art of Game Design" by Jesse Schell
- "Game Feel" by Steve Swink

---

## 📄 License & Credits

**Built with:**
- Three.js (MIT License)
- Howler.js (MIT License)
- TWEEN.js (MIT License)

**Inspired by:**
- Fears to Fathom series
- P.T. (Silent Hills)
- Gone Home

---

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork and modify
- Learn from the code
- Build your own horror games
- Share your creations

---

**Questions?** Review the code comments - they're comprehensive!

**Good luck with your horror game development! 👻**