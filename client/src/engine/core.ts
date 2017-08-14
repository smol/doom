// import GameObject from './GameObject';
/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />


/// <reference path="orbitcontrols.ts" />
/// <reference path="wall.ts" />

module Engine {
	export class Core {
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private textures: Wad.Textures[];

		constructor(canvas: HTMLCanvasElement) {
			
			let renderer = new THREE.WebGLRenderer({ canvas: canvas });

			this.initScene(canvas);
			this.initCamera(canvas);

			canvas.addEventListener('mousedown', onDocumentMouseDown);

			var raycaster = new THREE.Raycaster();
			raycaster.params.Points.threshold = 0.1;

			var self = this;

			function animate(): void {
				requestAnimationFrame(animate)
				render()
			}

			function render(): void {
				renderer.render(self.scene, self.camera)
			}

			function onDocumentMouseDown(event) {
				event.preventDefault();
				var y: number = event.clientY - canvas.getBoundingClientRect().top;

				var mouse3D = new THREE.Vector2((event.clientX / canvas.width) * 2 - 1, -(y / canvas.height) * 2 + 1);

				raycaster.setFromCamera(mouse3D, self.camera);
				var intersects = raycaster.intersectObjects(self.scene.children, true);
				console.info(mouse3D, intersects);
				if (intersects.length > 0) {
					let floor : Floor = intersects[0].object.parent.parent.parent as Floor;
					// let wall: Wall =  as Wall;

					console.info(floor.seg);
				}
			}

			animate()
		}

		private initCamera(canvas: HTMLCanvasElement) {
			this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
			this.camera.far = Infinity;

			this.camera.position.x = 500
			this.camera.position.y = 500
			this.camera.position.z = 500

			let controls = new Engine.OrbitControls(this.camera, canvas);
		}

		private initScene(canvas: HTMLCanvasElement) {
			this.scene = new THREE.Scene();

			let axis = new THREE.AxisHelper(10)

			this.scene.add(axis)

			// add lights
			let light = new THREE.DirectionalLight(0xffffff, 1.0)

			light.position.set(100, 100, 100)

			this.scene.add(light)

			let light2 = new THREE.DirectionalLight(0xffffff, 1.0)

			light2.position.set(-100, 100, -100)

			this.scene.add(light2)
		}

		private node(level: number, node: Wad.Node) {
			if (node === null)
				return;

			// console.info(level, node);

			this.subsector(node.getRightSubsector());
			this.subsector(node.getLeftSubsector());

			this.node(level + 1, node.getLeftNode());
			this.node(level + 1, node.getRightNode());
		}

		private subsector(subsector: Wad.Subsector) {
			if (subsector !== null) {
				let sector = new Sector(subsector, this.textures, this.scene);

				// for (var i = 0; i < segs.length; i++) {
				// 	// console.info(segs[i]);
				// 	if (segs[i].getLinedef().getFlag() === "NOTHING"){
				// 		continue;
				// 	}

				// 	let wall = new Engine.Wall(segs[i]);
				// 	let textureName : string = segs[i].getLinedef().getRightSidedef().getMiddle();
				// 	this.setTexture(wall, textureName);

				// 	// for (var t = 0; t < this.graphics.length; t++){
				// 	// 	for (var )
				// 	// 	if (this.graphics[t].getName() === textureName){
				// 	// 		wall.setTexture(this.graphics[t].getTextureByName());
				// 	// 		break;
				// 	// 	}
				// 	// }


				// 	this.objects.push(wall);
				// 	this.scene.add(wall);
				// }
			}
		}

		// setTexture(wall: Engine.Wall, textureName: string) {
		// 	for (var i = 0; i < this.graphics.length; i++) {
		// 		let textures: Wad.Texture[] = this.graphics[i].getTextures();
		// 		for (var j = 0; j < textures.length; j++) {
		// 			if (textures[j].getName() === textureName) {
		// 				// console.info(textures[j]);
		// 				wall.setTexture(textures[j].getPatches()[0].pname.getGraphics());
		// 				return
		// 			}
		// 		}
		// 	}
		// }

		createWalls(map: Wad.Map, wad: Wad.Wad) {
			this.textures = wad.getTextures();
			this.node(0, map.getNode());
		}
	}
}


