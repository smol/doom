import * as React from 'react';
/// <reference types="engine" />


export module Debug {
	interface SubsectorsProps {
		subsectors : Wad.Subsector[];
	}

	export class Subsector {
		private subsector : Wad.Subsector;

		constructor(subsector : Wad.Subsector){
			this.subsector = subsector;
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

		render(ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
			// this.renderBound(ctx, scale, position);

			let segs : Wad.Seg[] = this.subsector.getSegs();

			// if (segs.length > 2){
			// 	return;
			// }

			segs.forEach(seg => {
				this.renderSeg(seg, ctx, scale, position);
			});

			// this.renderFloor(ctx, scale, position);
		}
	}

	export class Subsectors extends React.Component<SubsectorsProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };
		private onClick: boolean = false;
		private scale: number = 0.5;
		private ctx: CanvasRenderingContext2D;
		private subsectors : Subsector[];

		constructor(props){
			super(props);

			this.subsectors = [];

			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.mouseUp = this.mouseUp.bind(this);

			this.position = { x: 500, y: 2000 };
			this.startPosition = { x: 0, y: 0 };
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
				// let x: number = e.pageX;
				// let y: number = e.pageY - (window.innerHeight / 2);

				// for (var i = 0; i < this.subsectors.length; i++) {
				// 	if (this.subsectors[i].onClick((x - this.position.x) / this.scale, (y - this.position.y) / this.scale)) {
				// 	}
				// }

				// this.update();
			}
		}

		private update() {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			this.ctx = canvas.getContext('2d');

			this.ctx.clearRect(0, 0, canvas.width, canvas.height);

			this.subsectors.forEach(subsector => {
				subsector.render(this.ctx, this.scale, this.position);
			});

			// 
		}

		private loopSubsectors(subsectors : Wad.Subsector[]){
			subsectors.forEach(subsector => {
				this.subsectors.push(new Subsector(subsector));
			});
		}

		componentWillReceiveProps(nextProps) {
			this.props = nextProps;

			this.subsectors = [];
			this.loopSubsectors(this.props.subsectors);

			this.update();
		}

		componentDidMount() {
			// (this.refs.canvas as HTMLCanvasElement).addEventListener('scroll', this.scroll);

			this.subsectors = [];
			this.loopSubsectors(this.props.subsectors);

			this.update();
			// ctx.scale(0.1, 0.1);
		}

		render(){
			return <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight / 2} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} />;
		}
	}
}