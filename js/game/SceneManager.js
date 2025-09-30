/**
 * SceneManager - Three.js scene setup and rendering
 */

import * as THREE from 'three';
import { ShadowFigure } from '../entities/ShadowFigure.js';
import { InteractableObject } from '../entities/InteractableObject.js';

// Make THREE globally available for compatibility
window.THREE = THREE;

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        
        this.lights = {};
        this.environment = {};
        this.interactables = [];
        
        this.shadowFigure = null;
        
        // Quality settings
        this.qualitySettings = {
            quality: 'high',
            shadowQuality: 'medium',
            postProcessing: true
        };
    }

    async init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2b3a67);
        this.scene.fog = new THREE.Fog(0x1a1f3a, 10, 50);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV
            window.innerWidth / window.innerHeight, // Aspect
            0.1, // Near
            1000 // Far
        );
        this.camera.position.set(0, 1.6, 0); // 12-year-old height
        
        // Create renderer
        this.container = document.getElementById('game-container');
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Set up lighting
        this.setupLighting();
        
        // Build environment (house)
        this.buildEnvironment();
        
        console.log('Scene initialized');
    }

    setupLighting() {
        // Ambient light (very dim)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        this.lights.ambient = ambientLight;
        
        // Evening sky light (from window)
        const skyLight = new THREE.DirectionalLight(0x2b3a67, 0.5);
        skyLight.position.set(10, 15, 10);
        this.scene.add(skyLight);
        this.lights.sky = skyLight;
        
        // Bedroom ceiling light (warm)
        const bedroomLight = new THREE.PointLight(0xffdb99, 1, 10);
        bedroomLight.position.set(0, 2.8, 0);
        bedroomLight.castShadow = true;
        bedroomLight.shadow.mapSize.width = 1024;
        bedroomLight.shadow.mapSize.height = 1024;
        this.scene.add(bedroomLight);
        this.lights.bedroom = bedroomLight;
        
        // Living room light
        const livingRoomLight = new THREE.PointLight(0xffdb99, 1.2, 15);
        livingRoomLight.position.set(0, 2.8, -10);
        livingRoomLight.castShadow = true;
        this.scene.add(livingRoomLight);
        this.lights.livingRoom = livingRoomLight;
        
        // Kitchen light
        const kitchenLight = new THREE.PointLight(0xffffff, 1.0, 12);
        kitchenLight.position.set(8, 2.8, -8);
        kitchenLight.castShadow = true;
        this.scene.add(kitchenLight);
        this.lights.kitchen = kitchenLight;
        
        // Hallway lights
        const hallwayLight1 = new THREE.PointLight(0xffdb99, 0.8, 8);
        hallwayLight1.position.set(-3, 2.8, -5);
        this.scene.add(hallwayLight1);
        this.lights.hallway1 = hallwayLight1;
        
        const hallwayLight2 = new THREE.PointLight(0xffdb99, 0.8, 8);
        hallwayLight2.position.set(3, 2.8, -5);
        this.scene.add(hallwayLight2);
        this.lights.hallway2 = hallwayLight2;
        
        // Bathroom light (will be turned off later)
        const bathroomLight = new THREE.PointLight(0xffffff, 1.0, 8);
        bathroomLight.position.set(-5, 2.8, 2);
        this.scene.add(bathroomLight);
        this.lights.bathroom = bathroomLight;
    }

    buildEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(30, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6f47,
            roughness: 0.4,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        this.environment.floor = floor;
        
        // Walls
        this.createWalls();
        
        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(30, 20);
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 3;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);
        this.environment.ceiling = ceiling;
        
        // Build rooms
        this.buildBedroom();
        this.buildLivingRoom();
        this.buildKitchen();
        this.buildBathroom();
        this.buildHallway();
        
        // Create shadow figure
        this.shadowFigure = new ShadowFigure(this.scene);
        this.environment.shadowFigure = this.shadowFigure.getMesh();
        
        // Set up interactable objects
        this.setupInteractables();
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const wallHeight = 3;
        
        // Outer walls
        const walls = [
            // North wall
            { width: 30, position: [0, wallHeight/2, -10] },
            // South wall
            { width: 30, position: [0, wallHeight/2, 10] },
            // East wall
            { width: 20, position: [15, wallHeight/2, 0], rotateY: Math.PI/2 },
            // West wall
            { width: 20, position: [-15, wallHeight/2, 0], rotateY: Math.PI/2 }
        ];
        
        walls.forEach(wallData => {
            const geometry = new THREE.BoxGeometry(wallData.width, wallHeight, 0.3);
            const wall = new THREE.Mesh(geometry, wallMaterial);
            wall.position.set(...wallData.position);
            if (wallData.rotateY) wall.rotation.y = wallData.rotateY;
            wall.castShadow = true;
            wall.receiveShadow = true;
            this.scene.add(wall);
        });
        
        // Interior walls (simplified)
        this.createInteriorWalls(wallMaterial, wallHeight);
    }

    createInteriorWalls(material, height) {
        // Bedroom walls
        const bedroomWall = new THREE.Mesh(
            new THREE.BoxGeometry(6, height, 0.3),
            material
        );
        bedroomWall.position.set(-9, height/2, 2.5);
        bedroomWall.castShadow = true;
        bedroomWall.receiveShadow = true;
        this.scene.add(bedroomWall);
        
        // Bathroom walls
        const bathroomWall = new THREE.Mesh(
            new THREE.BoxGeometry(4, height, 0.3),
            material
        );
        bathroomWall.position.set(-11, height/2, 0);
        bathroomWall.rotation.y = Math.PI/2;
        bathroomWall.castShadow = true;
        bathroomWall.receiveShadow = true;
        this.scene.add(bathroomWall);
        
        // Hallway divider
        const hallwayWall = new THREE.Mesh(
            new THREE.BoxGeometry(12, height, 0.3),
            material
        );
        hallwayWall.position.set(0, height/2, -3);
        hallwayWall.castShadow = true;
        hallwayWall.receiveShadow = true;
        this.scene.add(hallwayWall);
    }

    buildBedroom() {
        // Bed
        const bedGeometry = new THREE.BoxGeometry(2, 0.5, 1.5);
        const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x3366cc });
        const bed = new THREE.Mesh(bedGeometry, bedMaterial);
        bed.position.set(-11, 0.25, 7);
        bed.castShadow = true;
        bed.receiveShadow = true;
        this.scene.add(bed);
        this.environment.bed = bed;
        
        // Desk
        const deskGeometry = new THREE.BoxGeometry(1.2, 0.7, 0.6);
        const deskMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(-13, 0.35, 5);
        desk.castShadow = true;
        desk.receiveShadow = true;
        this.scene.add(desk);
        this.environment.desk = desk;
        
        // Nightstand
        const nightstandGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.4);
        const nightstand = new THREE.Mesh(nightstandGeometry, deskMaterial);
        nightstand.position.set(-10, 0.25, 7);
        nightstand.castShadow = true;
        nightstand.receiveShadow = true;
        this.scene.add(nightstand);
        this.environment.nightstand = nightstand;
        
        // Closet
        const closetGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.6);
        const closetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
        const closet = new THREE.Mesh(closetGeometry, closetMaterial);
        closet.position.set(-14, 1.25, 3);
        closet.castShadow = true;
        closet.receiveShadow = true;
        this.scene.add(closet);
        this.environment.closet = closet;
    }

    buildLivingRoom() {
        // Couch
        const couchGeometry = new THREE.BoxGeometry(2.5, 0.8, 1);
        const couchMaterial = new THREE.MeshStandardMaterial({ color: 0x6e6e6e });
        const couch = new THREE.Mesh(couchGeometry, couchMaterial);
        couch.position.set(0, 0.4, -6);
        couch.castShadow = true;
        couch.receiveShadow = true;
        this.scene.add(couch);
        this.environment.couch = couch;
        
        // Coffee table
        const tableGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.8);
        const tableMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d2d2d,
            roughness: 0.2,
            metalness: 0.3
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, 0.2, -8);
        table.castShadow = true;
        table.receiveShadow = true;
        this.scene.add(table);
        this.environment.coffeeTable = table;
        
        // TV stand
        const tvStandGeometry = new THREE.BoxGeometry(2, 0.6, 0.5);
        const tvStand = new THREE.Mesh(tvStandGeometry, new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
        tvStand.position.set(0, 0.3, -10);
        tvStand.castShadow = true;
        tvStand.receiveShadow = true;
        this.scene.add(tvStand);
        this.environment.tvStand = tvStand;
        
        // TV screen
        const tvGeometry = new THREE.BoxGeometry(1.8, 1, 0.1);
        const tvMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            emissive: 0x000000,
            roughness: 0.1
        });
        const tv = new THREE.Mesh(tvGeometry, tvMaterial);
        tv.position.set(0, 1.3, -10);
        tv.castShadow = true;
        this.scene.add(tv);
        this.environment.tv = tv;
    }

    buildKitchen() {
        // Refrigerator
        const fridgeGeometry = new THREE.BoxGeometry(1, 2, 0.8);
        const fridgeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xc0c0c0,
            roughness: 0.2,
            metalness: 0.8
        });
        const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
        fridge.position.set(10, 1, -5);
        fridge.castShadow = true;
        fridge.receiveShadow = true;
        this.scene.add(fridge);
        this.environment.fridge = fridge;
        
        // Counter
        const counterGeometry = new THREE.BoxGeometry(3, 0.9, 0.7);
        const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(7, 0.45, -7);
        counter.castShadow = true;
        counter.receiveShadow = true;
        this.scene.add(counter);
        this.environment.counter = counter;
        
        // Stove
        const stoveGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.7);
        const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const stove = new THREE.Mesh(stoveGeometry, stoveMaterial);
        stove.position.set(10, 0.45, -7);
        stove.castShadow = true;
        stove.receiveShadow = true;
        this.scene.add(stove);
        this.environment.stove = stove;
        
        // Kitchen table
        const kitchenTableGeometry = new THREE.BoxGeometry(1.5, 0.7, 1);
        const kitchenTable = new THREE.Mesh(kitchenTableGeometry, new THREE.MeshStandardMaterial({ color: 0xdaa520 }));
        kitchenTable.position.set(8, 0.35, -10);
        kitchenTable.castShadow = true;
        kitchenTable.receiveShadow = true;
        this.scene.add(kitchenTable);
        this.environment.kitchenTable = kitchenTable;
    }

    buildBathroom() {
        // Sink/Vanity
        const sinkGeometry = new THREE.BoxGeometry(1, 0.8, 0.5);
        const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
        sink.position.set(-11, 0.4, 2);
        sink.castShadow = true;
        sink.receiveShadow = true;
        this.scene.add(sink);
        this.environment.sink = sink;
        
        // Toilet
        const toiletGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.7);
        const toilet = new THREE.Mesh(toiletGeometry, sinkMaterial);
        toilet.position.set(-12, 0.3, 0);
        toilet.castShadow = true;
        toilet.receiveShadow = true;
        this.scene.add(toilet);
        this.environment.toilet = toilet;
        
        // Bathtub
        const tubGeometry = new THREE.BoxGeometry(1.7, 0.5, 0.8);
        const tub = new THREE.Mesh(tubGeometry, sinkMaterial);
        tub.position.set(-13, 0.25, 3);
        tub.castShadow = true;
        tub.receiveShadow = true;
        this.scene.add(tub);
        this.environment.tub = tub;
    }

    buildHallway() {
        // Hallway is mostly empty space, just add some decorative elements
        
        // Console table
        const consoleGeometry = new THREE.BoxGeometry(1, 0.6, 0.4);
        const consoleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
        const console = new THREE.Mesh(consoleGeometry, consoleMaterial);
        console.position.set(0, 0.3, -2);
        console.castShadow = true;
        console.receiveShadow = true;
        this.scene.add(console);
        this.environment.console = console;
    }

    setupInteractables() {
        // Make objects interactable
        const interactableObjects = [
            { mesh: this.environment.bed, name: 'Bed', type: 'examine' },
            { mesh: this.environment.desk, name: 'Desk', type: 'examine' },
            { mesh: this.environment.nightstand, name: 'Nightstand', type: 'examine' },
            { mesh: this.environment.closet, name: 'Closet', type: 'open' },
            { mesh: this.environment.couch, name: 'Couch', type: 'examine' },
            { mesh: this.environment.coffeeTable, name: 'Coffee Table', type: 'examine' },
            { mesh: this.environment.tv, name: 'TV', type: 'toggle' },
            { mesh: this.environment.fridge, name: 'Refrigerator', type: 'open' },
            { mesh: this.environment.sink, name: 'Sink', type: 'toggle' },
            { mesh: this.environment.stove, name: 'Stove', type: 'examine' },
        ];

        interactableObjects.forEach(obj => {
            if (obj.mesh) {
                const interactable = new InteractableObject(obj.mesh, obj.name, obj.type);
                this.interactables.push(interactable);
            }
        });
    }

    getInteractables() {
        return this.interactables.map(i => i.getMesh());
    }

    update(deltaTime) {
        // Update animations, effects, etc.
        if (this.shadowFigure) {
            this.shadowFigure.update(deltaTime);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    applyQualitySettings(settings) {
        this.qualitySettings = { ...this.qualitySettings, ...settings };
        
        // Apply shadow quality
        switch(settings.shadowQuality) {
            case 'off':
                this.renderer.shadowMap.enabled = false;
                break;
            case 'low':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.BasicShadowMap;
                break;
            case 'medium':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFShadowMap;
                break;
            case 'high':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                break;
        }
        
        // Apply general quality
        switch(settings.quality) {
            case 'low':
                this.renderer.setPixelRatio(1);
                break;
            case 'medium':
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                break;
            case 'high':
            case 'ultra':
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                break;
        }
    }

    destroy() {
        // Clean up resources
        this.renderer.dispose();
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

export default SceneManager;