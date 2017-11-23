/// <reference types="wad" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface VertexesProps {
	vertexes: Wad.Vertex[];
	linedefs: Wad.Linedef[];
}

export module Debug {
	export class Vertexes extends React.Component<VertexesProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };

		constructor(props: VertexesProps) {
			super(props);
			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.position = { x: 500, y: 500 };
			this.startPosition = { x: 0, y: 0 };
		}

		mouseMove(e) {
			if (e.buttons === 0){
				return;
			}

			this.position = {
				x: this.position.x + ((e.screenX - this.startPosition.x) * 2),
				y: this.position.y + ((e.screenY - this.startPosition.y) * 2)
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

			var scale = 0.5;

			
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
				
				ctx.moveTo((start.x - firstVertex.x) * scale, (start.y - firstVertex.y) * scale);
				ctx.lineTo((start.x - secondVertex.x) * scale, (start.y - secondVertex.y) * scale);

				
				ctx.stroke();
				ctx.closePath();
			}

			// ctx.moveTo((start.x - this.props.vertexes[0].x) * scale, (start.y - this.props.vertexes[0].y) * scale);
			// for (var i = 1; i < this.props.vertexes.length; i++){
			// 	ctx.lineTo((start.x - this.props.vertexes[i].x) * scale, (start.y - this.props.vertexes[i].y) * scale);

			// }
			

			// ctx.scale(scale, scale);
		}


		componentDidMount() {
			this.update();
			// ctx.scale(0.1, 0.1);
		}

		render() {
			return <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight / 2} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} />;
		}
	}
}
