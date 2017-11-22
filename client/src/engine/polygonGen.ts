/// <reference path="./delaunay/delaunay.ts" />
/// <reference path="./delaunay/wtf.ts" />
// import { Vector3 } from "../../../node_modules/@types/three/index";

module Engine {
	export class PolygonGeneration {
		private delaunay: Delaunay;
		private vertices: { x: number, y: number }[];
		private segments : Segment[];
		private faces : number[];

		constructor() {
			this.delaunay = new Delaunay();

			this.vertices = [];
			this.segments = [];
			this.faces = [];
		}

		addLinedef(linedef: Wad.Linedef, height: number){
			let start : THREE.Vector3 = new THREE.Vector3(linedef.getFirstVertex().x, height, linedef.getFirstVertex().y);
			let end : THREE.Vector3 = new THREE.Vector3(linedef.getSecondVertex().x, height, linedef.getSecondVertex().y);

			this.segments.push(new Segment(start, end));
		}

		start(){
			var wtf = new Wtf(this.segments);
			const orderedSegments = wtf.getPoints();
			// console.info(orderedSegments);

			var delaunay = new Delaunay();
			
			orderedSegments.forEach(segments => {
				delaunay.addSegments(segments);
			});

			if (orderedSegments.length > 1)
				delaunay.addHoles(orderedSegments[1]);

			this.faces = delaunay.start();
			this.vertices = delaunay.vertices;

			return orderedSegments;
		}

		getSegments() : Segment[] {
			return this.segments;
		}

		getVertices(): { x: number, y: number }[] {
			return this.vertices;
		}

		getFaces() : number[] {
			return this.faces;
		}
	}
}