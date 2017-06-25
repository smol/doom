export default class GameObject {
	protected children : GameObject[];
	public position : {x : number, y: number};
	protected ctx : any;

	constructor() {
		this.children = [];
		this.position = { x: 0, y: 0 };
		this.ctx = null;
	}

	addChild(child) {
		child.position.x += this.position.x;
		child.position.y += this.position.y;

		child.ctx = this.ctx;
		this.children.push(child);
	}

	update() {

	}

	draw() {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw();
		}
	}
}
