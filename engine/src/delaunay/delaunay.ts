const EPSILON: number = 1.0 / 1048576.0;

import { Wtf, Segment } from './wtf'

export class Delaunay {
	superTriangles: { x: number, y: number }[] = [];
	vertices: { x: number, y: number }[] = [];
	holes: { x: number, y: number }[] = [];
	centers: { x: number, y: number }[] = [];

	constructor() {
		this.vertices = [];
		this.holes = [];
		this.centers = [];
	}

	addPoints(points: { x: number, y: number }[]) {
		this.vertices = this.vertices.concat(points);
	}

	addHoles(segments: Segment[]) {
		for (let index = 0; index < segments.length; index++) {
			const element = segments[index];

			this.holes.push(
				{ x: element.start.x, y: element.start.z },
				{ x: element.end.x, y: element.end.z }
			);
		}
	}

	addSegments(segments: Segment[]) {
		for (let index = 0; index < segments.length; index++) {
			const element = segments[index];

			this.vertices.push(
				{ x: element.start.x, y: element.start.z },
				{ x: element.end.x, y: element.end.z }
			);
		}
	}

	start() {
		var n = this.vertices.length,
			i, j, indices, open, closed, edges, dx, dy, a, b, c;

		var self: Delaunay = this;

		/* Bail if there aren't enough vertices to form any triangles. */
		if (n < 3)
			return [];

		/* Slice out the actual vertices from the passed objects. (Duplicate the
		 * array even if we don't, though, since we need to make a supertriangle
		 * later on!) */
		this.vertices = this.vertices.slice(0);

		/* Make an array of indices into the vertex array, sorted by the
		 * vertices' x-position. Force stable sorting by comparing indices if
		 * the x-positions are equal. */
		indices = new Array(n);

		for (i = n; i--;)
			indices[i] = i;

		indices.sort(function (i, j) {
			var diff = self.vertices[j].x - self.vertices[i].x;
			return diff !== 0 ? diff : i - j;
		});

		/* Next, find the vertices of the supertriangle (which contains all other
		 * triangles), and append them onto the end of a (copy of) the vertex
		 * array. */
		var st: any = this.getSuperTriangle(this.vertices);
		this.vertices.push(st[0], st[1], st[2]);

		/* Initialize the open list (containing the supertriangle and nothing
		 * else) and the closed list (which is empty since we havn't processed
		 * any triangles yet). */
		open = [this.circumcircle(this.vertices, n + 0, n + 1, n + 2)];
		closed = [];
		edges = [];

		/* Incrementally add each vertex to the mesh. */
		for (i = indices.length; i--; edges.length = 0) {
			c = indices[i];

			/* For each open triangle, check to see if the current point is
			 * inside it's circumcircle. If it is, remove the triangle and add
			 * it's edges to an edge list. */
			for (j = open.length; j--;) {
				/* If this point is to the right of this triangle's circumcircle,
				 * then this triangle should never get checked again. Remove it
				 * from the open list, add it to the closed list, and skip. */
				dx = this.vertices[c].x - open[j].x;
				if (dx > 0.0 && dx * dx > open[j].r) {
					closed.push(open[j]);
					open.splice(j, 1);
					continue;
				}

				/* If we're outside the circumcircle, skip this triangle. */
				dy = this.vertices[c].y - open[j].y;
				if (dx * dx + dy * dy - open[j].r > EPSILON)
					continue;

				/* Remove the triangle and add it's edges to the edge list. */
				edges.push(
					open[j].i, open[j].j,
					open[j].j, open[j].k,
					open[j].k, open[j].i
				);
				open.splice(j, 1);
			}

			/* Remove any doubled edges. */
			this.dedup(edges);

			/* Add a new triangle for each edge. */
			for (j = edges.length; j;) {
				b = edges[--j];
				a = edges[--j];
				open.push(this.circumcircle(this.vertices, a, b, c));
			}
		}

		/* Copy any remaining open triangles to the closed list, and then
		 * remove any triangles that share a vertex with the supertriangle,
		 * building a list of triplets that represent triangles. */
		for (i = open.length; i--;)
			closed.push(open[i]);
		open.length = 0;



		for (i = closed.length; i--;)
			if (closed[i].i < n && closed[i].j < n && closed[i].k < n) {
				const firstPoint: { x: number, y: number } = this.vertices[closed[i].i];
				const secondPoint: { x: number, y: number } = this.vertices[closed[i].j];
				const thirdPoint: { x: number, y: number } = this.vertices[closed[i].k];

				const centerX = (firstPoint.x + secondPoint.x + thirdPoint.x) / 3;
				const centerY = (firstPoint.y + secondPoint.y + thirdPoint.y) / 3;

				this.centers.push({ x: centerX, y: centerY });

				if (!this.isInsidePolygon({ x: centerX, y: centerY }, this.holes)) {
					open.push(closed[i].i, closed[i].j, closed[i].k);
				}

			}

		// console.info(open);

		/* Yay, we're done! */
		return open;
	}

	private isInsidePolygon(point: { x: number, y: number }, vertices: { x: number, y: number }[]): boolean {
		var x = Math.round(point.x), y = Math.round(point.y);

		// var i, j = vertices.length - 1;
		// var oddNodes : number = 0;

		// var polyX = cornersX;
		// var polyY = cornersY;

		var minX = Math.min();
		var minY = Math.min();
		var maxX = Math.max();
		var maxY = Math.max();

		
		for (var i =0; i < vertices.length; i++){
			if (vertices[i].x < minX) minX = vertices[i].x;
			if (vertices[i].y < minY) minY = vertices[i].y;

			if (vertices[i].x > maxX) maxX = vertices[i].x;
			if (vertices[i].y > maxY) maxY = vertices[i].y;
		}

		return (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY);

		// for (i = 0; i < vertices.length; i++) {
		// 	if ((vertices[i].y < y && vertices[j].y >= y || vertices[j].y < y && vertices[i].y >= y) && (vertices[i].x <= x || vertices[j].x <= x)) {
		// 		oddNodes ^= (vertices[i].x + (y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < x) ? 1 : 0;
		// 	}

		// 	j = i;
		// }

		// return oddNodes == 1;

		// console.info(x, y, vertices);

		// var inside = false;
		// for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		// 	var xi = vertices[i].x, yi = vertices[i].y;
		// 	var xj = vertices[j].x, yj = vertices[j].y;

		// 	const intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		// 	if (intersect) inside = !inside;
		// }

		// return inside;
	}

	private circumcircle(vertices: any, i: any, j: any, k: any) {
		var x1 = vertices[i].x,
			y1 = vertices[i].y,
			x2 = vertices[j].x,
			y2 = vertices[j].y,
			x3 = vertices[k].x,
			y3 = vertices[k].y,
			fabsy1y2 = Math.abs(y1 - y2),
			fabsy2y3 = Math.abs(y2 - y3),
			xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

		/* Check for coincident points */
		if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
			throw new Error("Eek! Coincident points!");

		if (fabsy1y2 < EPSILON) {
			m2 = -((x3 - x2) / (y3 - y2));
			mx2 = (x2 + x3) / 2.0;
			my2 = (y2 + y3) / 2.0;
			xc = (x2 + x1) / 2.0;
			yc = m2 * (xc - mx2) + my2;
		}

		else if (fabsy2y3 < EPSILON) {
			m1 = -((x2 - x1) / (y2 - y1));
			mx1 = (x1 + x2) / 2.0;
			my1 = (y1 + y2) / 2.0;
			xc = (x3 + x2) / 2.0;
			yc = m1 * (xc - mx1) + my1;
		}

		else {
			m1 = -((x2 - x1) / (y2 - y1));
			m2 = -((x3 - x2) / (y3 - y2));
			mx1 = (x1 + x2) / 2.0;
			mx2 = (x2 + x3) / 2.0;
			my1 = (y1 + y2) / 2.0;
			my2 = (y2 + y3) / 2.0;
			xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
			yc = (fabsy1y2 > fabsy2y3) ?
				m1 * (xc - mx1) + my1 :
				m2 * (xc - mx2) + my2;
		}

		dx = x2 - xc;
		dy = y2 - yc;
		return { i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy };
	}

	private dedup(edges: any) {
		var i, j, a, b, m, n;

		for (j = edges.length; j;) {
			b = edges[--j];
			a = edges[--j];

			for (i = j; i;) {
				n = edges[--i];
				m = edges[--i];

				if ((a === m && b === n) || (a === n && b === m)) {
					edges.splice(j, 2);
					edges.splice(i, 2);
					break;
				}
			}
		}
	}


	private getSuperTriangle(vertices: any): [{ x: number, y: number }] {
		var xmin = Number.POSITIVE_INFINITY,
			ymin = Number.POSITIVE_INFINITY,
			xmax = Number.NEGATIVE_INFINITY,
			ymax = Number.NEGATIVE_INFINITY,
			i, dx, dy, dmax, xmid, ymid;

		for (i = vertices.length; i--;) {
			if (vertices[i].x < xmin) xmin = vertices[i].x;
			if (vertices[i].x > xmax) xmax = vertices[i].x;
			if (vertices[i].y < ymin) ymin = vertices[i].y;
			if (vertices[i].y > ymax) ymax = vertices[i].y;
		}

		dx = xmax - xmin;
		dy = ymax - ymin;
		dmax = Math.max(dx, dy);
		xmid = xmin + dx * 0.5;
		ymid = ymin + dy * 0.5;

		return [
			{ x: xmid - 20 * dmax, y: ymid - dmax },
			{ x: xmid, y: ymid + 20 * dmax },
			{ x: xmid + 20 * dmax, y: ymid - dmax }
		];
	}
}