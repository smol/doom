/// <reference path="delaunay.ts" />

class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(data: {x: number, y: number, z: number}) {
		this.x = data.x;
		this.y = data.y;
		this.z = data.z;
	}

	equals(vector : Vector3){
		return this.x == vector.x && this.y == vector.y && this.z == vector.z;
	}
}

class Segment {
	public start : Vector3;
	public end : Vector3;

	constructor(start : Vector3, end : Vector3){
		this.start = start;
		this.end = end;
	}

	invert() : Segment {
		return new Segment(this.end, this.start);
	}

	equals(segment : Segment){
		return (segment.end.equals(this.start) && segment.start.equals(this.end)) ||
			(segment.start.equals(this.start) && segment.end.equals(this.end));
	}
}

class Wtf {
	private segments: Segment[][];

	constructor(segments: Segment[]){
		this.segments = [];

		console.info(segments);

		// this.removeDuplicates(points);
		var toFlush = segments;
		var j = 0;
		var s = 0;
		var diff = toFlush.length;

		while (toFlush.length > 0){

			if (!this.segments[s])
				this.segments.push([]);

			if (this.segments[s].length == 0){
				this.segments[s].push(toFlush[j]);
				toFlush.splice(j, 1);
			}
	
			for (var i = 0; i < this.segments[s].length; i++){
				var segment = toFlush[j];
				if (!segment)
					break;

				if (this.segments[s][i].equals(toFlush[j])){
					toFlush.splice(j, 1);
					continue;
				}

				if (this.segments[s][i].start.equals(segment.end)){
					this.segments[s].splice(i + 1, 0, segment);
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].start.equals(segment.start)){
					this.segments[s].splice(i + 1, 0, segment.invert());
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].end.equals(segment.end)){
					this.segments[s].splice(i, 0, segment.invert());
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].end.equals(segment.start)){
					this.segments[s].splice(i, 0, segment);
					toFlush.splice(j, 1);
					i++;
				}
			}

			j++;

			if (j >= toFlush.length){
				if (toFlush.length == diff){
					s++;
					// break;
				}

				diff = toFlush.length;
				j = 0;
			}
		}
	}

	getPoints(): Segment[][] {
		return this.segments;
	}
}