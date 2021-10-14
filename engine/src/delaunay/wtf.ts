import * as THREE from 'three';

export class Segment {
  public start: THREE.Vector3;
  public end: THREE.Vector3;

  private children: Segment[];
  public parent: Segment = null;
  public isVisited: boolean = false;
  public level: number = -1;

  constructor(start: THREE.Vector3, end: THREE.Vector3) {
    this.start = start;
    this.end = end;
    this.children = [];
  }

  invert(): Segment {
    return new Segment(this.end, this.start);
  }

  equals(segment: Segment) {
    if (!segment) return false;
    return (
      (segment.end.equals(this.start) && segment.start.equals(this.end)) ||
      (segment.start.equals(this.start) && segment.end.equals(this.end))
    );
  }

  getChildren(): Segment[] {
    return this.children;
  }

  addChild(segment: Segment): Segment {
    segment.parent = this;
    segment.level = this.level + 1;
    this.children.push(segment);
    return segment;
  }

  isConnectedTo(to: Segment) {
    return (
      this.start.equals(to.end) || this.start.equals(to.start) //||
      // this.end.equals(to.start) ||
      // this.end.equals(to.end)
    );
  }

  compare(start: THREE.Vector3, end: THREE.Vector3): boolean {
    return start === end;
  }
}

export class Point {
  public position: THREE.Vector3;

  public linked: Point[];

  constructor(position: THREE.Vector3) {
    this.position = position;
    this.linked = [];
  }

  addPoint(point: THREE.Vector3) {
    this.linked.push(new Point(point));
  }
}

export class Wtf {
  private segments: Segment[][];
  private points: Point[];

  constructor() {}

  orderGraph(unorderedSegments: Segment[]) {
    this.orderSegment(unorderedSegments);
    // this.segments = [];

    let toFlush = [];
    this.segments.forEach(segments => {
      toFlush = toFlush.concat(segments);
    });
    this.segments = [];

    let last: Segment = toFlush[0];
    last.level = 0;

    toFlush.splice(0, 1);

    let paths: Segment[] = [last];
    let finalPaths: Segment[][] = [];

    while (toFlush.length > 0) {
      let diff: number = toFlush.length;

      for (let i = 0; i < toFlush.length; i++) {
        const toTest: Segment = toFlush[i];

        paths.forEach(firstNode => {
          const connectedNode: Segment = this.getConnectedNode(
            firstNode,
            toTest
          );

          if (connectedNode) {
            let child = connectedNode.addChild(toTest);
            toFlush.splice(i, 1);
            i--;

            if (child.level > 2 && child.isConnectedTo(firstNode)) {
              finalPaths.push(this.createPath(child, []));
            }
          }
        });
      }

      if (toFlush.length === diff) {
        paths.push(toFlush[0]);
        toFlush.splice(0, 1);
      }
    }

    this.segments = finalPaths.slice();
  }

  private getConnectedNode(node: Segment, child: Segment): Segment {
    if (node) {
      if (node.isConnectedTo(child)) {
        return node;
      }

      const children = node.getChildren();
      for (let i = 0; i < children.length; i++) {
        const connectedChild = this.getConnectedNode(children[i], child);
        if (connectedChild) return connectedChild;
      }
    }

    return null;
  }

  private createPath(last: Segment, path: Segment[]): Segment[] {
    if (!last) return path;
    path.push(last);

    path = this.createPath(last.parent, path);
    return path;
  }

  orderSegment(segments: Segment[]) {
    this.segments = [];

    // console.info(segments);

    // this.removeDuplicates(points);
    var toFlush = segments.slice();
    var j = 0;
    var s = 0;
    var diff = toFlush.length;

    // tant qu'il y a des segments a trier
    while (toFlush.length > 0) {
      // si le group de segments n'est pas init
      if (!this.segments[s]) this.segments.push([]);

      // si le group de segment est vide on ajout le premier element
      // et on le supprime de flush
      if (this.segments[s].length == 0) {
        this.segments[s].push(toFlush[j]);
        toFlush.splice(j, 1);
      }

      for (var i = 0; i < this.segments[s].length; i++) {
        let segment: Segment = toFlush[j];
        // si l'element a checker est deja dans le tableau final

        this.segments[s].forEach(temp => {
          if (temp.equals(toFlush[j])) {
            segment = null;
            toFlush.splice(j, 1);
          }
        });

        if (!segment) break;

        if (this.segments[s][i].start.equals(segment.end)) {
          // if a.start === b.end
          this.segments[s].splice(i, 0, segment);
          toFlush.splice(j, 1);
          i++;
        } else if (this.segments[s][i].end.equals(segment.start)) {
          // if a.end === b.start
          this.segments[s].splice(i + 1, 0, segment);
          toFlush.splice(j, 1);
          i++;
        } else if (this.segments[s][i].start.equals(segment.start)) {
          // if a.start === b.start
          this.segments[s].splice(i, 0, segment.invert());
          toFlush.splice(j, 1);
          i++;
        } else if (this.segments[s][i].end.equals(segment.end)) {
          // if a.end === b.end
          this.segments[s].splice(i + 1, 0, segment.invert());
          toFlush.splice(j, 1);
          i++;
        }
      }

      j++;
      if (j >= toFlush.length) {
        // si il n'y eu aucun changement dans le tableau à flusher
        if (toFlush.length === diff) {
          s++;
        }

        diff = toFlush.length;
        j = 0;
      }
    }

    // this.orderGroups();
  }

  orderPoints(segments: Segment[]) {
    this.points = [];
    let index = 0;

    segments.forEach(segment => {
      if (this.points.length === 0) {
        let point: Point = new Point(segment.start);
        point.addPoint(segment.end);
        this.points.push(point);
        return;
      }

      if (!this.insertSegment(segment, this.points[index])) {
        index++;
      }
    });
  }

  private insertSegment(segment: Segment, point: Point): boolean {
    let result = false;

    point.linked.forEach(subpoint => {
      if (subpoint.position.equals(segment.start)) {
        subpoint.addPoint(segment.end);
        result = true;
      } else if (subpoint.position.equals(segment.end)) {
        subpoint.addPoint(segment.start);
        result = true;
      } else if (!result) {
        result = this.insertSegment(segment, subpoint);
      }
    });

    return result;
  }

  private dotProduct(first: Segment, second: Segment) {
    const firstVector: THREE.Vector3 = first.end.sub(first.start);
    const secondVector: THREE.Vector3 = second.start.sub(second.end);

    console.info(
      firstVector,
      secondVector,
      this.getAngle(firstVector, secondVector)
    );
  }

  private getAngle(first: THREE.Vector3, second: THREE.Vector3): number {
    const dot: number = first.dot(second);
    const firstLength = first.length();
    const secondLength = second.length();
    return Math.acos(dot / (firstLength * secondLength));
  }

  private getClosest(
    from: THREE.Vector3,
    first: THREE.Vector3,
    second: THREE.Vector3
  ) {
    if (from.distanceTo(first) < from.distanceTo(second)) {
      return first;
    }
  }

  private orderGroups() {
    let firstGroup: Segment[] = this.segments[0].slice();
    for (var i = 1; i < this.segments.length; i++) {
      let currentGroup: Segment[] = this.segments[i];

      // si le group est bouclé
      if (
        currentGroup[0].start.equals(currentGroup[currentGroup.length - 1].end)
      ) {
        // console.info(currentGroup);
        continue;
      }

      let temp: Segment[] = this.segments.splice(i, 1)[0];
      i--;

      firstGroup.push(
        new Segment(firstGroup[firstGroup.length - 1].end, temp[0].start)
      );
      firstGroup = firstGroup.concat(temp);
    }

    firstGroup.push(
      new Segment(firstGroup[firstGroup.length - 1].end, firstGroup[0].start)
    );

    this.segments[0] = firstGroup.slice();
  }

  getSegments(): Segment[][] {
    return this.segments;
  }

  getPoints(): Point[] {
    return this.points;
  }
}
