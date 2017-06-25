import GameObject from './GameObject';

export default class Core {
	protected canvas : HTMLCanvasElement;
	protected ctx : CanvasRenderingContext2D;

	private gameobjects : GameObject[];

	static width = 0;
	static height = 0;

	constructor(idCanvas, fps) {
		var self = this;

		this.canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d');

		this.ctx.imageSmoothingEnabled = false;

		Core.width = this.canvas.width;
		Core.height = this.canvas.height;

		this.gameobjects = [];

		function loop() {
			self.update();
			self.draw();

			setTimeout(loop, 1000 / fps);
		}

		loop();
	}

	get getContext() : CanvasRenderingContext2D {
		return this.ctx;
	}

	addChild(child) {
		child.ctx = this.ctx;
		this.gameobjects.push(child);
	}

	update() {
		for (var i = 0; i < this.gameobjects.length; i++) {
			this.gameobjects[i].update();
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (var i = 0; i < this.gameobjects.length; i++) {
			this.gameobjects[i].draw();
		}
	}
}
