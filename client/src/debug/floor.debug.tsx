import * as React from 'react';
/// <reference types="engine" />


interface NodesProps {
	node: Wad.Node;
}


export module Debug {
	export class Floor extends React.Component<NodesProps> {
		constructor(props: NodesProps) {
			super(props);
		}
	}

	export class Floors extends React.Component<NodesProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };
		private scale: number = 1.0;
		private ctx: CanvasRenderingContext2D;

		constructor(props: NodesProps) {
			super(props);

			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.scroll = this.scroll.bind(this);

			this.position = { x: 1000, y: 4000 };
			this.startPosition = { x: 0, y: 0 };
		}

		scroll(e) {
			console.info(e);
		}

		mouseMove(e) {
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
			this.startPosition = { x: e.screenX, y: e.screenY };
		}

		private throughNode(node: Wad.Node, parent : Wad.Node) {
			if (node === null) {
				return;
			}

			if (node.getLeftSubsector() && node.getLeftSubsector().getSegs().length > 1)
				this.renderBound(parent.getLeftBounds(), "green");
			if (node.getRightSubsector() && node.getRightSubsector().getSegs().length > 1)
				this.renderBound(parent.getRightBounds(), "red");
			
			this.renderSubsector(node.getLeftSubsector());
			this.renderSubsector(node.getRightSubsector());

			this.throughNode(node.getLeftNode(), node);
			this.throughNode(node.getRightNode(), node);
		}

		private renderSubsector(subsector: Wad.Subsector) {
			if (subsector == null) {
				return;
			}
			let segs: Wad.Seg[] = subsector.getSegs();

			for (var i = 0; i < segs.length; i++) {
				this.renderSeg(segs[i]);
			}
			this.renderFloor(segs);
		}

		private generateVertices(segs: Wad.Seg[], graham : Engine.Graham): { x: number, y: number }[] {
			let vertices: { x: number, y: number }[] = [];

			segs.forEach(seg => {
				var firstVertex: Wad.Vertex = seg.getStartVertex();
				var secondVertex: Wad.Vertex = seg.getEndVertex();

				graham.addPoint({ x: (firstVertex.x * this.scale) + this.position.x, y: (firstVertex.y * this.scale) + this.position.y });
				graham.addPoint({ x: (secondVertex.x * this.scale) + this.position.x, y: (secondVertex.y * this.scale) + this.position.y });
				// vertices.push({ x: (firstVertex.x * this.scale) + this.position.x, y: (firstVertex.y * this.scale) + this.position.y });
				// vertices.push({ x: (secondVertex.x * this.scale) + this.position.x, y: (secondVertex.y * this.scale) + this.position.y });
			});

			// return vertices;
			return graham.sort();
		}

		private renderFloor(segs: Wad.Seg[]) {
			this.ctx.beginPath();
			let graham = new Engine.Graham();

			let vertices = this.generateVertices(segs,graham);
			// console.info(vertices);
			let red: number = Math.round(Math.random() * 255);
			let green: number = Math.round(Math.random() * 255);
			let blue: number = Math.round(Math.random() * 255);

			this.ctx.strokeStyle = 'rgba(' + red + ',' + green + ',' + blue + ', 1)';
			this.ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ', 0.2)';

			for (var i = 2; i < vertices.length; i++) {
				this.ctx.moveTo(vertices[0].x, vertices[0].y);
				this.ctx.lineTo(vertices[i - 1].x, vertices[i - 1].y);
				this.ctx.lineTo(vertices[i].x, vertices[i].y);
				this.ctx.lineTo(vertices[0].x, vertices[0].y);
			}

			this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		}

		private renderSeg(seg: Wad.Seg) {
			var firstVertex: Wad.Vertex = seg.getStartVertex();
			var secondVertex: Wad.Vertex = seg.getEndVertex();

			this.ctx.beginPath();
			this.ctx.strokeStyle = 'white';

			this.ctx.moveTo((firstVertex.x) * this.scale + this.position.x, (firstVertex.y) * this.scale + this.position.y);
			this.ctx.lineTo((secondVertex.x) * this.scale + this.position.x, (secondVertex.y) * this.scale + this.position.y);

			this.ctx.stroke();
			this.ctx.closePath();
		}

		private update() {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			this.ctx = canvas.getContext('2d');

			this.ctx.clearRect(0, 0, canvas.width, canvas.height);

			this.throughNode(this.props.node, null);
		}

		private renderBound(bounds : { lX: number, lY: number, uX: number, uY: number }, color: string) {
			this.ctx.beginPath();
			this.ctx.moveTo(bounds.uX * this.scale + this.position.x, bounds.uY * this.scale + this.position.y);
			this.ctx.lineTo(bounds.lX * this.scale + this.position.x, bounds.uY * this.scale + this.position.y);
			this.ctx.lineTo(bounds.lX * this.scale + this.position.x, bounds.lY * this.scale + this.position.y);
			this.ctx.lineTo(bounds.uX * this.scale + this.position.x, bounds.lY * this.scale + this.position.y);
			this.ctx.lineTo(bounds.uX * this.scale + this.position.x, bounds.uY * this.scale + this.position.y);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.closePath();

			// console.info(rightBounds, leftBounds, node);

			// console.info(
			// 	(rightBounds.uX) * scale, (rightBounds.uY) * scale,
			// 	(rightBounds.lX) * scale, (rightBounds.lY) * scale
			// );



			// this.renderNode(node.getRightNode(), ctx, start, scale);
			// this.renderNode(node.getLeftNode(), ctx, start, scale);
		}

		componentWillReceiveProps(nextProps) {
			this.props = nextProps;
			this.update();
		}

		componentDidMount() {
			(this.refs.canvas as HTMLCanvasElement).addEventListener('scroll', this.scroll);
			this.update();
			// ctx.scale(0.1, 0.1);
		}

		componentWillUnmount() {
			(this.refs.canvas as HTMLCanvasElement).removeEventListener('scroll', this.scroll);
		}

		render() {
			return <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight / 2} onScroll={this.scroll} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} />;
		}
	}
}