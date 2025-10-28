import { SceneManager } from './SceneManager.js';

export class GameManager{
	constructor(rootEl){
		this.rootEl = rootEl;
		this.renderer = null;
		this.camera = null;
		this.sceneManager = null;
		this.clock = new THREE.Clock();
		this.composer = null;
		this.resizeObserver = null;
	}

	async init(){
		this._createRenderer();
		this._createCamera();
		this.sceneManager = new SceneManager(this.renderer, this.camera);
		await this.sceneManager.init();
		this._createComposer();
		this._bindResize();
	}

	start(){
		const animate = ()=>{
			requestAnimationFrame(animate);
			const dt = this.clock.getDelta();
			TWEEN.update();
			this.sceneManager.update(dt);
			if(this.composer){
				this.composer.render();
			}else{
				this.renderer.render(this.sceneManager.scene, this.camera);
			}
		};
		animate();
	}

	_createRenderer(){
		this.renderer = new THREE.WebGLRenderer({antialias:true});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.rootEl.appendChild(this.renderer.domElement);
	}

	_createCamera(){
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 1.6, 4);
	}

	_createComposer(){
		const composer = new POSTPROCESSING.EffectComposer(this.renderer);
		const renderPass = new POSTPROCESSING.RenderPass(this.sceneManager.scene, this.camera);
		composer.addPass(renderPass);
		const vignette = new POSTPROCESSING.VignetteEffect({ darkness: 0.35, eskil: false, offset: 0.4 });
		const effectPass = new POSTPROCESSING.EffectPass(this.camera, vignette);
		effectPass.renderToScreen = true;
		composer.addPass(effectPass);
		this.composer = composer;
	}

	_bindResize(){
		window.addEventListener('resize', ()=>{
			this.camera.aspect = window.innerWidth/window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			if(this.composer){
				this.composer.setSize(window.innerWidth, window.innerHeight);
			}
		});
	}
}