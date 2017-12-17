import * as React from 'react';
import * as Wad from 'wad';
import * as Engine from 'engine';


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
		private generator : Engine.PolygonGeneration;
		// private node: Wad.Node;
		private linedefs: Wad.Linedef[];
		private sector: Wad.Sector;
		private bounds: { uX: number, uY: number, lX: number, lY: number };

		private isSelected: boolean = false;
		private red: number;
		private blue: number;
		private green: number;

		private vertices : { x: number, y: number }[];
		private faces : number[];
		private orderedsegments : Segment[][];
		// private segments : Segment[];
		private segments : Segment[];

		private triangles : poly2tri.Triangle[];


		constructor(sector: Wad.Sector) {
			this.sector = sector;

			this.linedefs = [];
			if (sector){
				sector.getSidedefs().forEach(sidedef => {
					this.linedefs.push(sidedef.getLinedef());
				});
			}
				

			this.vertices = [];
			this.faces = [];
			this.segments = [];

			var generator = new Engine.PolygonGeneration();
			this.linedefs.forEach(linedef => {
				generator.addLinedef(linedef, 0);
			});

			

			this.orderedsegments = generator.start();

			this.vertices = generator.getVertices();
			
			this.faces = generator.getFaces();
			this.segments = generator.getSegments();
			this.triangles = generator.triangles;

			this.red = Math.round(Math.random() * 255);
			this.green = Math.round(Math.random() * 255);
			this.blue = Math.round(Math.random() * 255);

			this.bounds = {
				lX: Infinity,
				lY: Infinity,
				uX: -Infinity,
				uY: -Infinity
			};

			// // found bounds for click
			this.orderedsegments.forEach(segments => {
				segments.forEach(segment => {
					if (segment.start.x < this.bounds.lX)
						this.bounds.lX = segment.start.x;
					else if (segment.start.x > this.bounds.uX)
						this.bounds.uX = segment.start.x;

					if (segment.start.z < this.bounds.lY)
						this.bounds.lY = segment.start.z;
					else if (segment.start.z > this.bounds.uY)
						this.bounds.uY = segment.start.z;
				});
			});

			// console.info(this.bounds);
		}

		onClick(x: number, y: number){
			if ((x >= this.bounds.lX && x <= this.bounds.uX) && (y >= this.bounds.lY && y <= this.bounds.uY)){
				console.info(this.orderedsegments);

				
				// console.info('test', this.orderedsegments, this.segments);
			}
		}

		render(ctx: CanvasRenderingContext2D, scale: number, position: { x: number, y: number }) {
			
			ctx.fillStyle = 'rgba('+ this.red +', '+ this.green + ','+ this.blue +', 0.3)';
			ctx.strokeStyle = 'white';

			// this.orderedsegments.forEach(segments => {
			// 	ctx.beginPath();
			// 	segments.forEach(segment => {
					
			// 		var x = (segment.start.x + position.x) * scale;
			// 		var y = (segment.start.z + position.y) * scale;
					
			// 		ctx.lineTo(x, y);

			// 		var x = (segment.end.x + position.x) * scale;
			// 		var y = (segment.end.z + position.y) * scale;
			// 		ctx.lineTo(x, y);
					
			// 	});
			// 	ctx.stroke();
			// 	ctx.fill();
			// 	ctx.closePath();
			// });

			

			// console.info(JSON.stringify(this.vertices));
			
			if (!this.triangles)
				return;

			this.triangles.forEach(triangle => {
				ctx.beginPath();

				triangle.getPoints().forEach(temp => {
					let point = { x : (temp.x + position.x) * scale, y : (temp.y + position.y) * scale };
					// console.info(point);
					ctx.lineTo(point.x, point.y);
				})

				ctx.stroke();
				ctx.fill();
				ctx.closePath();
			});

			// for (var i = 0; i < this.faces.length; i += 3){
			// 	let first = { x : (this.vertices[this.faces[i]].x + position.x) * scale, y : (this.vertices[this.faces[i]].y + position.y) * scale };
			// 	let second = { x : (this.vertices[this.faces[i + 1]].x + position.x) * scale, y : (this.vertices[this.faces[i + 1]].y + position.y) * scale };
			// 	let third = { x : (this.vertices[this.faces[i + 2]].x + position.x) * scale, y : (this.vertices[this.faces[i + 2]].y + position.y) * scale };

			// 	ctx.beginPath();
			// 	ctx.arc(first.x,first.y,10 * scale,0,2*Math.PI);
			// 	ctx.arc(second.x,second.y,10 * scale,0,2*Math.PI);
			// 	ctx.arc(third.x,first.y,10 * scale,0,2*Math.PI);
				

			// 	ctx.moveTo(first.x, first.y);
			// 	ctx.lineTo(second.x, second.y);
			// 	ctx.lineTo(third.x, third.y);

			// 	ctx.stroke();
			// 	ctx.closePath();
			// }

			// this.vertices.forEach((vertex, i) => {
			// 	let x = (vertex.x + position.x) * scale;
			// 	let y = (vertex.y + position.y) * scale;

			// 	ctx.lineTo(x, y);
			// })

			// ctx.fill();
			// ctx.stroke();
			// ctx.closePath();
		}
	}

	export class Floors extends React.Component<NodesProps> {
		private position: { x: number, y: number };
		private startPosition: { x: number, y: number };
		private onClick: boolean = false;
		private scale: number = 0.2;
		private ctx: CanvasRenderingContext2D;
		private floors: Floor[];

		constructor(props: NodesProps) {
			super(props);

			this.floors = [];

			this.mouseMove = this.mouseMove.bind(this);
			this.mouseDown = this.mouseDown.bind(this);
			this.mouseUp = this.mouseUp.bind(this);
			this.scroll = this.scroll.bind(this);

			this.position = { x: -1000, y: 3000 };
			// this.position = {x: 0, y: 0};
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
					if (this.floors[i].onClick((x / this.scale) - this.position.x, (y / this.scale) - this.position.y)) {
					}
				}

				this.update();
			}
		}

		private loopSectors(sectors : Wad.Sector[]){
			console.info(sectors);
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