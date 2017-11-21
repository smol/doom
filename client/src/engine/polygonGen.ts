module Engine {
	export class PlaneGeneration {
		private vertices: { x: number, y: number }[];

		compare(first: Wad.Vertex, second: Wad.Vertex, last: { x: number, y: number }): { x: number, y: number, isFirst: boolean } {
			if (first.x == last.x && first.y == last.y) {
				return { x: first.x, y: first.y, isFirst: true };
			} else if (second.x == last.x && second.y == last.y) {
				return { x: second.x, y: second.y, isFirst: false };
			}

			return null;
		}

		sortLinedefs(linedefs: Wad.Linedef[]) {
			let vertices: { x: number, y: number, index: number }[] = [];

			var i = 0;
			var lastVertex: { x: number, y: number } = linedefs[0].getSecondVertex();

			// var secondLastVertex : { x:number, y: number } = linedefs[0].getSecondVertex();

			vertices.push({
				x: linedefs[0].getFirstVertex().x,
				y: linedefs[0].getFirstVertex().y,
				index: 0
			});

			var firstlastVertex: { x: number, y: number } = vertices[0];

			console.info(linedefs.length, linedefs);

			linedefs.splice(0, 1);



			for (var i = 0; i < linedefs.length; i++) {
				let firstVertex = linedefs[i].getFirstVertex();
				let secondVertex = linedefs[i].getSecondVertex();

				let finalVertex = this.compare(firstVertex, secondVertex, lastVertex);
				if (finalVertex) {
					vertices.push({ x: finalVertex.x, y: finalVertex.y, index: i });
					lastVertex = finalVertex.isFirst ? secondVertex : firstVertex;
					linedefs.splice(i, 1);
					i = 0;
					continue;
				}

				finalVertex = this.compare(firstVertex, secondVertex, firstlastVertex);
				if (finalVertex) {
					vertices.splice(0, 0, { x: finalVertex.x, y: finalVertex.y, index: i });
					firstlastVertex = finalVertex.isFirst ? secondVertex : firstVertex;
					linedefs.splice(i, 1);
					i = 0;
					continue;
				}
			}

			console.info(vertices, linedefs);

			return vertices;
		}

		constructor(sidedefs: Wad.Sidedef[]) {
			this.vertices = [];

			let graham: Graham = new Graham();
			let vertices: { x: number, y: number }[] = [];
			let linedefs: Wad.Linedef[] = [];

			let segments: { start: { x: number, y: number }, end: { x: number, y: number } }[] = [];

			sidedefs.forEach(sidedef => {

				linedefs.push(sidedef.getLinedef());



				var firstVertex: Wad.Vertex = sidedef.getLinedef().getFirstVertex();
				var secondVertex: Wad.Vertex = sidedef.getLinedef().getSecondVertex();

				segments.push({
					start: { x: firstVertex.x, y: firstVertex.y },
					end : { x: secondVertex.x, y: secondVertex.y }
				});

				// var firstVertex: Wad.Vertex = sidedef.;
				// var secondVertex: Wad.Vertex = sidedef.getEndVertex();

				// first vertex;
				// graham.addPoint({ x: firstVertex.x, y: firstVertex.y });

				// second vertex
				// graham.addPoint({ x: secondVertex.x, y: secondVertex.y });

				// vertices.push(linedef.)
				// vertices.push(sidedef.getPosition());
				vertices.push({ x: firstVertex.x, y: firstVertex.y });
				// vertices.push({  x: secondVertex.x, y: secondVerteyx.y  });
			});

			// this.vertices = this.sortLinedefs(linedefs);
			console.info(JSON.stringify(segments));

			// if (segs.length <= 2) {
			// 	graham.addPoint({ x: bounds.uX, y: bounds.uY });
			// 	graham.addPoint({ x: bounds.uX, y: bounds.lY });
			// 	graham.addPoint({ x: bounds.lX, y: bounds.lY });
			// 	graham.addPoint({ x: bounds.lX, y: bounds.uY });
			// }


			// this.vertices = graham.sort();
			// this.vertices = vertices;
		}

		getVertices(): { x: number, y: number }[] {
			return this.vertices;
		}
	}

	class HeapSort {



		constructor() {

		}

		addLinedef(linedef: Wad.Linedef) {

		}

		sort() {

		}
	}

	export class Graham {
		private points: THREE.Vector2[];
		private anchorPoint: THREE.Vector2;

		constructor() {
			this.points = [];
		}

		addPoint(point: { x: number, y: number }) {
			//Check for a new anchor
			var newAnchor: boolean = (this.anchorPoint === undefined) || (this.anchorPoint.y > point.y) || (this.anchorPoint.y === point.y && this.anchorPoint.x > point.x);

			if (newAnchor) {
				if (this.anchorPoint !== undefined) {
					this.points.push(this.anchorPoint);
				}
				this.anchorPoint = new THREE.Vector2(point.x, point.y);
			} else {
				this.points.push(new THREE.Vector2(point.x, point.y));
			}

			// console.info('addPoint', this.points);
		}

		private findPolarAngle(anchor: THREE.Vector2, point: THREE.Vector2): number {
			var ONE_RADIAN = 57.295779513082;
			var deltaX, deltaY;

			//if the points are undefined, return a zero difference angle.
			if (!anchor || !point) return 0;

			deltaX = (point.x - anchor.x);
			deltaY = (point.y - anchor.y);

			if (deltaX == 0 && deltaY == 0) {
				return 0;
			}

			var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

			// if (this.reverse) {
			// 	if (angle <= 0) {
			// 		angle += 360;
			// 	}
			// } else {
			if (angle >= 0) {
				angle += 360;
			}
			// }

			return angle;
		}

		private sortPoints(): THREE.Vector2[] {
			var self = this;

			return this.points.sort((a, b) => {
				var polarA = self.findPolarAngle(self.anchorPoint, a);
				var polarB = self.findPolarAngle(self.anchorPoint, b);

				if (polarA < polarB) {
					return -1;
				}
				if (polarA > polarB) {
					return 1;
				}

				return 0;
			});
		}

		private checkPoints(p0: THREE.Vector2, p1: THREE.Vector2, p2: THREE.Vector2) {
			var difAngle;
			var cwAngle = this.findPolarAngle(p0, p1);
			var ccwAngle = this.findPolarAngle(p0, p2);

			if (cwAngle > ccwAngle) {

				difAngle = cwAngle - ccwAngle;

				return !(difAngle > 180);

			} else if (cwAngle < ccwAngle) {

				difAngle = ccwAngle - cwAngle;

				return (difAngle > 180);

			}

			return true;
		}

		sort(): { x: number, y: number }[] {
			if (this.points.length == 0) {
				return [];
			}

			var hullPoints: THREE.Vector2[] = [];
			let points: THREE.Vector2[];
			let pointsLength: number;


			points = this.sortPoints();
			pointsLength = points.length;

			//If there are less than 3 points, joining these points creates a correct hull.
			if (pointsLength < 3) {
				points.unshift(this.anchorPoint);
				return points;
			}

			//move first two points to output array
			hullPoints.push(points.shift(), points.shift());



			//scan is repeated until no concave points are present.
			while (true) {
				hullPoints.push(points.shift());

				let p0 = hullPoints[hullPoints.length - 3];
				let p1 = hullPoints[hullPoints.length - 2];
				let p2 = hullPoints[hullPoints.length - 1];

				// if (this.checkPoints(p0, p1, p2)) {
				// 	hullPoints.splice(hullPoints.length - 2, 1);
				// }

				if (points.length == 0) {
					if (pointsLength == hullPoints.length) {
						//check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
						var ap = this.anchorPoint;
						//remove any udefined elements in the hullPoints array.
						hullPoints = hullPoints.filter(function (p) { return !!p; });

						if (!hullPoints.some(function (p) {
							return (p.x == ap.x && p.y == ap.y);
						})) {
							hullPoints.unshift(this.anchorPoint);
						}

						return hullPoints;
					}

					points = hullPoints;
					pointsLength = points.length;
					hullPoints = [];
					hullPoints.push(points.shift(), points.shift());
				}
			}

		}

		getPoints(): THREE.Vector2[] {
			return this.points;
		}
	}
}