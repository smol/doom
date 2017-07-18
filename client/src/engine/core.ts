// import GameObject from './GameObject';
/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />


/// <reference path="orbitcontrols.ts" />
/// <reference path="wall.ts" />

module Engine {
	export class Core {
		constructor(canvas: HTMLCanvasElement, wad : Wad.Wad) {
			let scene = new THREE.Scene();
			let camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

			let renderer = new THREE.WebGLRenderer({ canvas: canvas });

			let axis = new THREE.AxisHelper(10)

			scene.add(axis)

			// add lights
			let light = new THREE.DirectionalLight(0xffffff, 1.0)

			light.position.set(100, 100, 100)

			scene.add(light)

			let light2 = new THREE.DirectionalLight(0xffffff, 1.0)

			light2.position.set(-100, 100, -100)

			scene.add(light2)

			camera.position.x = 5
			camera.position.y = 5
			camera.position.z = 5

			let controls = new Engine.OrbitControls(camera, canvas);

			camera.lookAt(scene.position)

			let wall = new Engine.Wall();
			wall.setTexture(wad.getGraphics()[Math.round(Math.random() * wad.getGraphics().length )]);
			scene.add(wall);

			function animate(): void {
				requestAnimationFrame(animate)
				render()
			}

			function render(): void {
				// let timer = 0.002 * Date.now()
				// box.position.y = 0.5 + 0.5 * Math.sin(timer)
				// box.rotation.x += 0.1
				renderer.render(scene, camera)
			}

			animate()
		}
	}
}


