module Engine {
	export class GameObject {
		protected children: GameObject[];
		public position: { x: number, y: number };
		protected gl: WebGLRenderingContext;

		constructor() {
			this.children = [];
			this.position = { x: 0, y: 0 };
			this.gl = null;
		}

		addChild(child) {
			child.position.x += this.position.x;
			child.position.y += this.position.y;

			child.addGl(this.gl);
			this.children.push(child);
		}

		update() {

		}

		draw() {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].draw();
			}
		}

		addGl(gl: WebGLRenderingContext){
			this.gl = gl;
		}
	}

}

