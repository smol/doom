import * as React from 'react';
/// <reference types="engine" />


interface NodesProps {
	node: Wad.Node;
	sectors : Wad.Sector[];
}

interface FloorGraphicOptions {
	ctx: CanvasRenderingContext2D;
	boundsColor: string,
	scale: number;
	position: { x: number, y: number };
}


export module Debug {
	export class Floor {
		private plane : Engine.PlaneGeneration;
		// private node: Wad.Node;
		private sidedefs: Wad.Sidedef[];
		private sector: Wad.Sector;
		// private bounds: { uX: number, uY: number, lX: number, lY: number };

		private isSelected: boolean = false;
		private red: number;
		private blue: number;
		private green: number;

		constructor(sector: Wad.Sector) {
			
			// this.node = node;
			this.sector = sector;
			// this.bounds = bounds;

			this.sidedefs = [];
			if (sector)
				this.sidedefs = sector.getSidedefs();

			this.plane = new Engine.PlaneGeneration(this.sidedefs);

			// this.vertices = this.generateVertices();

			// console.info(vertices);
			this.red = Math.round(Math.random() * 255);
			this.green = Math.round(Math.random() * 255);
			this.blue = Math.round(Math.random() * 255);
		}

		private renderSeg(seg: Wad.Seg, ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
			var firstVertex: Wad.Vertex = seg.getStartVertex();
			var secondVertex: Wad.Vertex = seg.getEndVertex();

			ctx.beginPath();
			ctx.strokeStyle = 'white';

			ctx.moveTo((firstVertex.x) * scale + position.x, (firstVertex.y) * scale + position.y);
			ctx.lineTo((secondVertex.x) * scale + position.x, (secondVertex.y) * scale + position.y);

			ctx.stroke();
			ctx.closePath();
		}

		private renderFloor(ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
			ctx.beginPath();

			ctx.strokeStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ', ' + (this.isSelected ? '1' : '1') + ')';
			ctx.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ', ' + (this.isSelected ? '0.2' : '0.2') + ')';

			let vertices = this.plane.getVertices();
			//console.info(vertices);

			ctx.moveTo((vertices[0].x * scale) + position.x, (vertices[0].y * scale) + position.y);
			for (var i = 2; i < vertices.length; i++) {
				// console.info((vertices[i - 1].x * scale) + position.x, (vertices[i - 1].y * scale) + position.y);

				// ctx.moveTo((vertices[0].x * scale) + position.x, (vertices[0].y * scale) + position.y);
				ctx.lineTo((vertices[i - 1].x * scale) + position.x, (vertices[i - 1].y * scale) + position.y);
				ctx.lineTo((vertices[i].x * scale) + position.x, (vertices[i].y * scale) + position.y);
				// ctx.lineTo((vertices[0].x * scale) + position.x, (vertices[0].y * scale) + position.y);
			}

			ctx.lineTo((vertices[0].x * scale) + position.x, (vertices[0].y * scale) + position.y);

			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}

		// private renderBound(ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
		// 	ctx.beginPath();
		// 	ctx.moveTo(this.bounds.uX * scale + position.x, this.bounds.uY * scale + position.y);
		// 	ctx.lineTo(this.bounds.lX * scale + position.x, this.bounds.uY * scale + position.y);
		// 	ctx.lineTo(this.bounds.lX * scale + position.x, this.bounds.lY * scale + position.y);
		// 	ctx.lineTo(this.bounds.uX * scale + position.x, this.bounds.lY * scale + position.y);
		// 	ctx.lineTo(this.bounds.uX * scale + position.x, this.bounds.uY * scale + position.y);
		// 	ctx.strokeStyle = 'red';
		// 	ctx.stroke();
		// 	ctx.closePath();

		// 	// console.info(rightBounds, leftBounds, node);

		// 	// console.info(
		// 	// 	(rightBounds.uX) * scale, (rightBounds.uY) * scale,
		// 	// 	(rightBounds.lX) * scale, (rightBounds.lY) * scale
		// 	// );



		// 	// this.renderNode(node.getRightNode(), ctx, start, scale);
		// 	// this.renderNode(node.getLeftNode(), ctx, start, scale);
		// }

		private pointRectangleIntersection(p, r): Boolean {
			let left = Math.min(r.uX, r.lX);
			let right = Math.max(r.uX, r.lX);
			let top = Math.min(r.uY, r.lY);
			let bottom = Math.max(r.uY, r.lY);


			return p.x > left && p.x < right && p.y > top && p.y < bottom;
		}

		onClick(x: number, y: number): Boolean {
			return false;
			// this.isSelected = false;

			// if (this.pointRectangleIntersection({ x: x, y: y }, this.bounds)) {
			// 	this.debug();

			// 	this.isSelected = true;

			// 	return true;
			// }

			// return false;
		}

		private debug() {
			console.info('---- DEBUG FLOOR');
			console.info('r:', this.red, 'g: ', this.green, 'b:', this.blue);
			console.info('subsector :', this.sector);
			// console.info('node :', this.node);
		}

		render(ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
			// this.renderBound(ctx, scale, position);

			// this.segs.forEach(seg => {
			// 	this.renderSeg(seg, ctx, scale, position);
			// })

			this.renderFloor(ctx, scale, position);
		}
	}

	export class Floors extends React.Component<NodesProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };
		private onClick: boolean = false;
		private scale: number = 0.5;
		private ctx: CanvasRenderingContext2D;
		private floors: Floor[];

		constructor(props: NodesProps) {
			super(props);

			this.floors = [];

			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.mouseUp = this.mouseUp.bind(this);
			this.scroll = this.scroll.bind(this);

			this.position = { x: 500, y: 2000 };
			this.startPosition = { x: 0, y: 0 };
		}

		scroll(e) {
			console.info(e);
		}

		mouseMove(e) {
			this.onClick = false;
			if (e.buttons === 0) {
				return;
			}

			this.position = {
				x: this.position.x + ((e.screenX - this.startPosition.x) * (1 / this.scale)),
				y: this.position.y + ((e.screenY - this.startPosition.y) * (1 / this.scale))
			};

			this.update();

			this.startPosition = { x: e.screenX, y: e.screenY };
		}

		mouseDown(e) {
			this.onClick = true;
			this.startPosition = { x: e.screenX, y: e.screenY };
		}

		mouseUp(e) {
			if (this.onClick) {
				let x: number = e.pageX;
				let y: number = e.pageY - (window.innerHeight / 2);

				for (var i = 0; i < this.floors.length; i++) {
					if (this.floors[i].onClick((x - this.position.x) / this.scale, (y - this.position.y) / this.scale)) {
					}
				}

				this.update();
			}
		}

		// private throughNode(node: Wad.Node, parent: Wad.Node) {
		// 	if (node === null) {
		// 		return;
		// 	}

		// 	if (node.getLeftSubsector())
		// 		this.floors.push(new Floor(node.getLeftSubsector(), node, node.getLeftBounds()));

		// 	if (node.getRightSubsector())
		// 		this.floors.push(new Floor(node.getRightSubsector(), node, node.getRightBounds()));

		// 	// if (node.getLeftSubsector() && node.getLeftSubsector().getSegs().length > 1)
		// 	// 	this.renderBound(parent.getLeftBounds(), "green");
		// 	// if (node.getRightSubsector() && node.getRightSubsector().getSegs().length > 1)
		// 	// 	this.renderBound(parent.getRightBounds(), "red");

		// 	// this.renderSubsector(node.getLeftSubsector());
		// 	// this.renderSubsector(node.getRightSubsector());

		// 	this.throughNode(node.getLeftNode(), node);
		// 	this.throughNode(node.getRightNode(), node);
		// }

		private loopSectors(sectors : Wad.Sector[]){
			sectors.forEach(sector => {
				this.floors.push(new Floor(sector));
			});
		}

		private update() {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			this.ctx = canvas.getContext('2d');

			this.ctx.clearRect(0, 0, canvas.width, canvas.height);

			this.floors.forEach(floor => {
				floor.render(this.ctx, this.scale, this.position);
			});

			// 
		}



		componentWillReceiveProps(nextProps) {
			this.props = nextProps;

			this.floors = [];
			// this.throughNode(this.props.node, null);
			this.loopSectors(this.props.sectors);

			this.update();
		}

		componentDidMount() {
			(this.refs.canvas as HTMLCanvasElement).addEventListener('scroll', this.scroll);

			this.floors = [];
			// this.throughNode(this.props.node, null);
			this.loopSectors(this.props.sectors);

			this.update();
			// ctx.scale(0.1, 0.1);
		}

		componentWillUnmount() {
			(this.refs.canvas as HTMLCanvasElement).removeEventListener('scroll', this.scroll);
		}

		render() {
			return <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight / 2} onScroll={this.scroll} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} />;
		}
	}
}