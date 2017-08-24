module Engine {
	export class PolygonGeneration {
		constructor(){

		}
	}

	export class Graham {
		private points: THREE.Vector2[];
		private anchorPoint: THREE.Vector2;

		constructor() {
			this.points = [];
		}

		addPoint(point: {x : number, y: number}) {
			//Check for a new anchor
			var newAnchor: Boolean = (this.anchorPoint === undefined) || (this.anchorPoint.y > point.y) || (this.anchorPoint.y === point.y && this.anchorPoint.x > point.x);

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

		private checkPoints(p0 : THREE.Vector2, p1 : THREE.Vector2, p2 : THREE.Vector2){
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

		sort(): {x: number, y: number}[] {
			if (this.points.length == 0){
				return [];
			}

			var hullPoints : THREE.Vector2[] = [];
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

		getPoints() : THREE.Vector2[] {
			return this.points;
		}
	}
}