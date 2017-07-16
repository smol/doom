// import GameObject from './GameObject';
/// <reference path="gameobject.ts" />

module Engine {
	export class Core {
		protected canvas: HTMLCanvasElement;
		protected gl: WebGLRenderingContext;

		private gameobjects: GameObject[];

		static width = 0;
		static height = 0;

		constructor(canvas : HTMLCanvasElement, fpsMax : number) {
			var self : Core = this;

			this.update = this.update.bind(this);
			this.draw = this.draw.bind(this);

			this.canvas = canvas;
			this.gl = this.canvas.getContext('webgl');

			Core.width = this.canvas.width;
			Core.height = this.canvas.height;

			this.gameobjects = [];

			this.gl.clearColor(27.0/255,27.0/255,27.0/255, 1.0); // Clear to the Inovia black
			this.gl.clearDepth(1.0); // Clear the depth buffer
			this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing (objects in the front hide the others)

			var cube = new Cube();

			this.addChild(cube);


			function loop() {
				self.update();
				self.draw();

				setTimeout(loop, 1000 / fpsMax);
			}

			loop();
		}

		get getContext(): WebGLRenderingContext {
			return this.gl;
		}

		addChild(child : GameObject) {
			child.addGl(this.gl);
			this.gameobjects.push(child);
		}

		update() {
			for (var i = 0; i < this.gameobjects.length; i++) {
				this.gameobjects[i].update();
			}
		}

		draw() {
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


			// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// for (var i = 0; i < this.gameobjects.length; i++) {
			// 	this.gameobjects[i].draw();
			// }
		}
	}
}


