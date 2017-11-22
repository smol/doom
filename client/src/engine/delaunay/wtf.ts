/// <reference path="delaunay.ts" />

class Segment {
	public start : THREE.Vector3;
	public end : THREE.Vector3;

	constructor(start : THREE.Vector3, end : THREE.Vector3){
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

		// console.info(segments);

		// this.removeDuplicates(points);
		var toFlush = segments.slice();
		var j = 0;
		var s = 0;
		var diff = toFlush.length;

		// tant qu'il y a des segmetns a trier
		while (toFlush.length > 0){

			// si le group de segments n'est pas init
			if (!this.segments[s])
				this.segments.push([]);

			// si le group de segment est vide on ajout le premier element
			// et on le supprime de flush
			if (this.segments[s].length == 0){
				this.segments[s].push(toFlush[j]);
				toFlush.splice(j, 1);
			}
	
			for (var i = 0; i < this.segments[s].length; i++){
				var segment = toFlush[j];
				if (!segment)
					break;

				// si l'element a checker est deja dans le tableau final
				if (this.segments[s][i].equals(toFlush[j])){
					toFlush.splice(j, 1);
					continue;
				}

				if (this.segments[s][i].start.equals(segment.end)){ // if a.start === b.end
					this.segments[s].splice(i, 0, segment);
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].start.equals(segment.start)){ // if a.start === b.start
					this.segments[s].splice(i, 0, segment.invert());
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].end.equals(segment.end)){ // if a.end === b.end
					this.segments[s].splice(i + 1, 0, segment.invert());
					toFlush.splice(j, 1);
					i++;
				} else if (this.segments[s][i].end.equals(segment.start)){// if a.end === b.start
					this.segments[s].splice(i + 1, 0, segment);
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

		this.orderGroups();
	}

	private getClosest(from : THREE.Vector3, first : THREE.Vector3, second: THREE.Vector3){
		if (from.distanceTo(first) < from.distanceTo(second)){
			return first;
		}


	}

	private orderGroups(){
		let firstGroup : Segment[] = this.segments[0].slice(); 
		for (var i = 1; i < this.segments.length; i++){
			let currentGroup : Segment[] = this.segments[i];

			// si le group est bouclé
			if (currentGroup[0].start.equals(currentGroup[currentGroup.length - 1].end)){
				// console.info(currentGroup);
				continue;
			}

			let temp : Segment[] = this.segments.splice(i, 1)[0];
			i--;

			firstGroup.push(new Segment(firstGroup[firstGroup.length - 1].end, temp[0].start));
			firstGroup = firstGroup.concat(temp);
		}

		firstGroup.push(new Segment(firstGroup[firstGroup.length - 1].end, firstGroup[0].start));

		this.segments[0] = firstGroup.slice();
	}

	getPoints(): Segment[][] {
		return this.segments;
	}
}