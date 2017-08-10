// import GameObject from './GameObject';
/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />


/// <reference path="orbitcontrols.ts" />
/// <reference path="wall.ts" />

module Engine {
	export class Core {
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private objects: Wall[] = [];
		private graphics : Wad.Textures[];

		constructor(canvas: HTMLCanvasElement) {
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
			this.camera.far = Infinity;

			canvas.addEventListener('mousedown', onDocumentMouseDown);

			let renderer = new THREE.WebGLRenderer({ canvas: canvas });

			let axis = new THREE.AxisHelper(10)

			this.scene.add(axis)

			// add lights
			let light = new THREE.DirectionalLight(0xffffff, 1.0)

			light.position.set(100, 100, 100)

			this.scene.add(light)

			let light2 = new THREE.DirectionalLight(0xffffff, 1.0)

			light2.position.set(-100, 100, -100)

			this.scene.add(light2)

			this.camera.position.x = 500
			this.camera.position.y = 500
			this.camera.position.z = 500

			var raycaster = new THREE.Raycaster();
			raycaster.params.Points.threshold = 0.1;

			let controls = new Engine.OrbitControls(this.camera, canvas);

			var self = this;

			function animate(): void {
				requestAnimationFrame(animate)
				render()
			}

			function render(): void {
				// let timer = 0.002 * Date.now()
				// box.position.y = 0.5 + 0.5 * Math.sin(timer)
				// box.rotation.x += 0.1
				renderer.render(self.scene, self.camera)
			}

			function onDocumentMouseDown(event) {
				event.preventDefault();
				var y : number = event.clientY - canvas.getBoundingClientRect().top;

				var mouse3D = new THREE.Vector2((event.clientX / canvas.width) * 2 - 1, -(y / canvas.height) * 2 + 1);
				// mouse3D = mouse3D.unproject(self.camera)
				
				raycaster.setFromCamera(mouse3D, self.camera);
				var intersects = raycaster.intersectObjects(self.objects, true);
			
				// self.objects.forEach(element => {

					// ((element.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(0xFF00000);
				// });

				if (intersects.length > 0) {
					let wall : Wall = intersects[0].object.parent as Wall;

					console.info(wall.seg);
					// ((intersects[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(0x00ff00);

				}
			}

			animate()
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
				var segs: Wad.Seg[] = subsector.getSegs();
				console.info(segs);
				this.scene.add(new Engine.Floor(segs));

				for (var i = 0; i < segs.length; i++) {
					// console.info(segs[i]);
					if (segs[i].getLinedef().getFlag() === "NOTHING"){
						continue;
					}

					let wall = new Engine.Wall(segs[i]);
					let textureName : string = segs[i].getLinedef().getRightSidedef().getMiddle();
					this.setTexture(wall, textureName);

					// for (var t = 0; t < this.graphics.length; t++){
					// 	for (var )
					// 	if (this.graphics[t].getName() === textureName){
					// 		wall.setTexture(this.graphics[t].getTextureByName());
					// 		break;
					// 	}
					// }
					

					this.objects.push(wall);
					this.scene.add(wall);
				}
			}
		}

		setTexture(wall : Engine.Wall, textureName : string){
			for (var i = 0; i < this.graphics.length; i++){
				let textures : Wad.Texture[] = this.graphics[i].getTextures();
				for (var j = 0; j < textures.length; j++){
					if (textures[j].getName() === textureName){
						console.info(textures[j]);
						wall.setTexture(textures[j].getPatches()[0].pname.getGraphics());
						return
					}
				}
			}
		}

		createWalls(map: Wad.Map, wad: Wad.Wad) {
			this.graphics = wad.getTextures();
			let linedefs: Wad.Linedef[] = map.getLinedefs();
			let graphics: Wad.Graphic[] = wad.getGraphics();
			let vertexes: Wad.Vertex[] = map.getVertexes();

			// console.info(map.getNodes());
			this.node(0, map.getNode());
			// for (var i = 0; i < linedefs.length; i++) {
			// 	if (linedefs[i].getFlag() === 'Not on Map' || linedefs[i].getFlag() === 'Two-sided')
			// 		continue;

			// 	var firstVertex: Wad.Vertex = vertexes[linedefs[i].getFirst()];
			// 	var secondVertex: Wad.Vertex = vertexes[linedefs[i].getSecond()];

			// 	let wall = new Engine.Wall(firstVertex, secondVertex);

			// 	// for (var i =0; i < graphics.length; i++){
			// 	// 	if (graphics[i].getName().indexOf("DOOR2_4") !== -1){
			// 	// 		wall.setTexture(graphics[i]);
			// 	// 		break;
			// 	// 	}
			// 	// }

			// 	// console.info(linedefs[i]);

			// 	let index = Math.round(Math.random() * graphics.length)
			// 	// console.info(index);
			// 	wall.setTexture(graphics[index]);



			// 	this.scene.add(wall);
			// }

		}
	}
}


