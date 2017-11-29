/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />

module Engine {
	export class Camera extends THREE.PerspectiveCamera {
		private canvas : HTMLCanvasElement;

		// -- USE FOR FPS
		private angle : number; // in radian
		// ---

		// -- USE FOR DEBUGGING
		private raycaster : THREE.Raycaster;
		private scene : THREE.Scene;
		// ---

		constructor(ratio : number, canvas: HTMLCanvasElement, scene: THREE.Scene){
			super(60, ratio, 0.1, 3000);
			this.scene = scene;

			this.canvas = canvas;
			this.angle = -Math.PI / 2; // -90 degrees

			this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);

			this.raycaster = new THREE.Raycaster();
			this.raycaster.params.Points.threshold = 0.1;
			this.canvas.addEventListener('mousedown', this.onDocumentMouseDown);
		}

		rotate(degree : number){
			this.angle += THREE.Math.degToRad(degree);
			this.rotation.y = this.angle;
		}

		moveForward(speed){
			let x : number = Math.sin(this.angle) * speed;
			let y : number = Math.cos(this.angle) * speed;

			this.position.add(new THREE.Vector3(-x, 0, -y));
		}

		// -- USE FOR DEBUGGING
		activeOrbitControl(scene : THREE.Scene, position : THREE.Vector3) {
			this.scene = scene;

			this.position.x = position.x;
			this.position.y = position.y;
			this.position.z = position.z;

			let controls = new Engine.OrbitControls(this, this.canvas);

		

			// this.lookAt(new THREE.Vector3(0, 0,0 ));


		}

		onDocumentMouseDown(event) {
			event.preventDefault();
			var y: number = event.clientY - this.canvas.getBoundingClientRect().top;

			var mouse3D = new THREE.Vector2((event.clientX / this.canvas.width) * 2 - 1, -(y / this.canvas.height) * 2 + 1);

			this.raycaster.setFromCamera(mouse3D, this);
			var intersects = this.raycaster.intersectObjects(this.scene.children, true);


			if (intersects.length > 0) {
				console.info(intersects[0].object.parent);
			}
		}
		// ---
	}
}