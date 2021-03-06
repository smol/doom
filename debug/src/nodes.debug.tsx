import * as React from 'react';

import * as Wad from 'wad';

interface NodesProps {
	node : Wad.Node;
	linedefs : Wad.Linedef[];
	vertexes: Wad.Vertex[];
}


export module Debug {
	export class Node extends React.Component<NodesProps> {
		constructor(props : NodesProps){
			super(props);
		}
	}

	export class Nodes extends React.Component<NodesProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };
		private scale : number = 0.3;

		constructor(props : NodesProps){
			super(props);

			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.scroll = this.scroll.bind(this);

			
			
			this.position = { x: 700, y: 700 };
			this.startPosition = { x: 0, y: 0 };
		}

		scroll(e){
			console.info(e);
		}

		mouseMove(e) {
			if (e.buttons === 0){
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

		private update() {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

			// console.warn('vertexes', this.props.vertexes, 'linedefs', this.props.linedefs);

			ctx.beginPath();

			
			var start: { x: number, y: number } = {
				x: this.props.vertexes[this.props.linedefs[0].getFirst()].x,
				y: this.props.vertexes[this.props.linedefs[0].getFirst()].y,
			};

			start.x += this.position.x;
			start.y += this.position.y;

			// console.warn('start', start);

			ctx.clearRect(0,0,canvas.width, canvas.height);
			// ctx.moveTo((start.x - this.props.vertexes[0].y) * scale, (start.y - this.props.vertexes[0].y) * scale);
			for (var i = 0; i < this.props.linedefs.length; i++) {
				var firstVertexIndex: number = this.props.linedefs[i].getFirst();
				var secondVertexIndex: number = this.props.linedefs[i].getSecond();
				var firstVertex: Wad.Vertex = this.props.vertexes[firstVertexIndex];
				var secondVertex: Wad.Vertex = this.props.vertexes[secondVertexIndex];

				
				// console.warn("first", firstVertex.x, firstVertex.y);
				// console.warn("second", secondVertex.x, secondVertex.y);
				ctx.beginPath();
				if (this.props.linedefs[i].getFlag() === 'Secret'){
					ctx.strokeStyle = 'red';
				} else {
					ctx.strokeStyle = 'white';
				}
				
				ctx.moveTo((start.x - firstVertex.x) * this.scale, (start.y - firstVertex.y) * this.scale);
				ctx.lineTo((start.x - secondVertex.x) * this.scale, (start.y - secondVertex.y) * this.scale);

				
				ctx.stroke();
				ctx.closePath();
			}
			console.info('RENDER NODE', this.props.node);
			this.renderNode(this.props.node, ctx, start, this.scale);
		}

		private renderNode(node : Wad.Node, ctx : CanvasRenderingContext2D, start : {x: number, y: number}, scale: number){
			if (node === null){
				return
			}

			let rightBounds : { lX: number, lY: number, uX: number, uY: number } = node.getRightBounds();

			ctx.beginPath();
			ctx.moveTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.uY) * scale);
			ctx.lineTo((start.x - rightBounds.lX) * scale, (start.y - rightBounds.uY) * scale);
			ctx.lineTo((start.x - rightBounds.lX) * scale, (start.y - rightBounds.lY) * scale);
			ctx.lineTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.lY) * scale);
			ctx.lineTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.uY) * scale);
			ctx.strokeStyle = "blue";
			ctx.stroke();
			ctx.closePath();

			let leftBounds : { lX: number, lY: number, uX: number, uY: number } = node.getLeftBounds();

			ctx.beginPath();
			ctx.moveTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.uY) * scale);
			ctx.lineTo((start.x - leftBounds.lX) * scale, (start.y - leftBounds.uY) * scale);
			ctx.lineTo((start.x - leftBounds.lX) * scale, (start.y - leftBounds.lY) * scale);
			ctx.lineTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.lY) * scale);
			ctx.lineTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.uY) * scale);
			ctx.strokeStyle = "green";
			ctx.stroke();
			ctx.closePath();

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

		componentWillUnmount(){
			(this.refs.canvas as HTMLCanvasElement).removeEventListener('scroll', this.scroll);
		}

		render() {
			return <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight / 2} onScroll={ this.scroll } onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} />;
		}
	}
}