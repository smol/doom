import * as THREE from 'three';
import * as Wad from 'wad';

import { Segment, Wtf } from './delaunay/wtf';
import { Delaunay } from './delaunay/delaunay';

import * as poly2tri from 'poly2tri';

export class PolygonGeneration {
  private delaunay: Delaunay;
  private vertices: { x: number; y: number }[];
  private segments: Segment[];
  private faces: number[];
  triangles: poly2tri.Triangle[][];

  constructor() {
    this.delaunay = new Delaunay();

    this.vertices = [];
    this.segments = [];
    this.faces = [];
  }

  addLinedef(linedef: Wad.Linedef, height: number) {
    let start: THREE.Vector3 = new THREE.Vector3(
      linedef.getFirstVertex().x,
      height,
      linedef.getFirstVertex().y
    );
    let end: THREE.Vector3 = new THREE.Vector3(
      linedef.getSecondVertex().x,
      height,
      linedef.getSecondVertex().y
    );

    this.segments.push(new Segment(start, end));
  }

  addSegments(segs: Segment[]) {
    this.segments = segs.slice();
  }

  start() {
    this.vertices = [];
    this.triangles = [];

    const wtf = new Wtf();
    wtf.orderGraph(this.segments);
    const orderedSegments = wtf.getSegments();
    // console.info('orderedSegment', this.segments, orderedSegments);
    if (!orderedSegments[0]) return [];

    const contour = this.createContour(orderedSegments[0]);

    // console.info(contour);
    try {
      // contours.forEach((contour, index) => {
      if (contour.length === 0) return;

      const swctx = new poly2tri.SweepContext(contour);

      for (let index = 1; index < orderedSegments.length; index++) {
        const segments = orderedSegments[index];
        let hole = [];

        segments.forEach(segment => {
          hole.push(new poly2tri.Point(segment.start.x, segment.start.z));
        });

        swctx.addHole(hole);
      }

      swctx.triangulate();
      this.triangles.push(swctx.getTriangles());
      // this.createVertices(this.triangles);
      // });
    } catch (e) {
      console.error(e);
      console.warn('-------');

      console.warn(JSON.stringify(orderedSegments));
      // orderedSegments[0].forEach((segment, i) => {
      //   console.warn(i, segment.start, segment.end);
      // });

      console.warn('-------');
      throw {};
    }
    // console.info(this.vertices);

    // --- END POLY2TRI

    return orderedSegments;
  }

  private createVertices(triangles: poly2tri.Triangle[]) {
    this.triangles[0].forEach(triangle => {
      triangle.getPoints().forEach(point => {
        this.vertices.push({ x: point.x, y: point.y });
      });
    });
  }

  private createContour(segments: Segment[]): poly2tri.Point[] {
    var contours: poly2tri.Point[][] = [];
    var c = 0;

    contours.push([]);

    return segments.map(segment => {
      return new poly2tri.Point(segment.start.x, segment.start.z);
    });

    // for (var i = 0; i < segments.length; i++) {
    //   const segment = segments[i];

    //   let start = new poly2tri.Point(segment.start.x, segment.start.z);
    //   let end = new poly2tri.Point(segment.end.x, segment.end.z);

    //   // let alreadyExist = false;
    //   // for (var y = 0; y < contours[c].length; y++) {
    //   //   if (contours[c][y].x == start.x && contours[c][y].y == start.y) {
    //   //     alreadyExist = true;
    //   //     break;
    //   //   }
    //   // }

    //   // if (alreadyExist) continue;

    //   contours[c].push(start);
    //   // if (
    //   //   segments[0].start.x === segment.end.x &&
    //   //   segments[0].start.z === segment.end.z
    //   // ) {
    //   //   c++;
    //   //   contours.push([]);
    //   // }
    // }

    // return contours;
  }

  getSegments(): Segment[] {
    return this.segments;
  }

  getVertices(): { x: number; y: number }[] {
    return this.vertices;
  }

  getFaces(): number[] {
    return this.faces;
  }
}
