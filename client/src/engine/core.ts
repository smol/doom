// import GameObject from './GameObject';
/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />


/// <reference path="orbitcontrols.ts" />
/// <reference path="wall.ts" />

module Engine {
	export class Core {
		private scene: THREE.Scene;

		constructor(canvas: HTMLCanvasElement) {
			this.scene = new THREE.Scene();
			let camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
			camera.far = Infinity;

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

			camera.position.x = 500
			camera.position.y = 500
			camera.position.z = 500

			let controls = new Engine.OrbitControls(camera, canvas);

			// camera.lookAt(wall.position)

			var self = this;

			function animate(): void {
				requestAnimationFrame(animate)
				render()
			}

			function render(): void {
				// let timer = 0.002 * Date.now()
				// box.position.y = 0.5 + 0.5 * Math.sin(timer)
				// box.rotation.x += 0.1
				renderer.render(self.scene, camera)
			}

			animate()
		}

		private node(node : Wad.Node){
			if (node === null)
				return;

			console.info(node);

			this.node(node.getLeftNode());
			this.node(node.getRightNode());
		}

		createWalls(wad: Wad.Wad) {
			var map: Wad.Map = wad.getMaps()[0];

			let linedefs: Wad.Linedef[] = map.getLinedefs();


			let graphics: Wad.Graphic[] = wad.getGraphics();
			let vertexes: Wad.Vertex[] = map.getVertexes();

			
			this.node(map.getNode());
			for (var i = 0; i < linedefs.length; i++) {
				if (linedefs[i].getFlag() === 'Not on Map' || linedefs[i].getFlag() === 'Two-sided')
					continue;

				var firstVertex: Wad.Vertex = vertexes[linedefs[i].getFirst()];
				var secondVertex: Wad.Vertex = vertexes[linedefs[i].getSecond()];

				let wall = new Engine.Wall(firstVertex, secondVertex);

				// for (var i =0; i < graphics.length; i++){
				// 	if (graphics[i].getName().indexOf("DOOR2_4") !== -1){
				// 		wall.setTexture(graphics[i]);
				// 		break;
				// 	}
				// }

				// console.info(linedefs[i]);

				let index = Math.round(Math.random() * graphics.length)
				// console.info(index);
				wall.setTexture(graphics[index]);



				this.scene.add(wall);
			}

		}
	}
}


