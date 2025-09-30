export class SceneManager{
	constructor(renderer, camera){
		this.renderer = renderer;
		this.camera = camera;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x0a0a0a);
		this.time = 0;
	}

	async init(){
		this._addLights();
		this._addDebugRoom();
	}

	_addLights(){
		const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.35);
		hemi.position.set(0, 20, 0);
		this.scene.add(hemi);
		const dir = new THREE.DirectionalLight(0xffdb99, 0.6);
		dir.position.set(5, 10, 2);
		dir.castShadow = true;
		dir.shadow.mapSize.set(1024,1024);
		this.scene.add(dir);
	}

	_addDebugRoom(){
		// Floor
		const floorGeo = new THREE.PlaneGeometry(30, 20);
		const floorMat = new THREE.MeshStandardMaterial({color:0x8b6f47, roughness:0.9, metalness:0.0});
		const floor = new THREE.Mesh(floorGeo, floorMat);
		floor.rotation.x = -Math.PI/2;
		floor.receiveShadow = true;
		this.scene.add(floor);
		// Simple walls outline
		const wallMat = new THREE.MeshStandardMaterial({color:0xf5f5dc});
		const wallH = 3;
		const thickness = 0.05;
		const walls = [];
		walls.push(new THREE.Mesh(new THREE.BoxGeometry(30, wallH, thickness), wallMat)); // north
		walls[walls.length-1].position.set(0, wallH/2, -10);
		walls.push(new THREE.Mesh(new THREE.BoxGeometry(30, wallH, thickness), wallMat)); // south
		walls[walls.length-1].position.set(0, wallH/2, 10);
		walls.push(new THREE.Mesh(new THREE.BoxGeometry(thickness, wallH, 20), wallMat)); // west
		walls[walls.length-1].position.set(-15, wallH/2, 0);
		walls.push(new THREE.Mesh(new THREE.BoxGeometry(thickness, wallH, 20), wallMat)); // east
		walls[walls.length-1].position.set(15, wallH/2, 0);
		for(const w of walls){
			w.castShadow = true; w.receiveShadow = true; this.scene.add(w);
		}

		// Placeholder prop
		const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color:0x1a1a1a, metalness:0.1, roughness:0.7}));
		box.position.set(0,0.5,0);
		box.castShadow = true; box.receiveShadow = true;
		this.scene.add(box);
		this.pulse = box;
	}

	update(dt){
		this.time += dt;
		if(this.pulse){
			this.pulse.scale.setScalar(1 + Math.sin(this.time*2)*0.05);
		}
	}
}