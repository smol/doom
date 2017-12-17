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
  triangles: poly2tri.Triangle[];

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

  start() {
    var wtf = new Wtf(this.segments.slice());
    const orderedSegments = wtf.getPoints();
    // console.info(orderedSegments);

    // --- DELAUNAY
    // var delaunay = new Delaunay();

    // orderedSegments.forEach(segments => {
    // 	delaunay.addSegments(segments);
    // });

    // if (orderedSegments.length > 1)
    // 	delaunay.addHoles(orderedSegments[1]);

    // this.faces = delaunay.start();
    // this.vertices = delaunay.vertices;
    // --- END DELAUNAY

    // --- EARCUT

    // let vertices = [];

    // orderedSegments.forEach(segments => {
    // 	segments.forEach(segment => {
    // 		this.vertices.push({x: segment.start.x, y: segment.start.z}, {x: segment.end.x, y: segment.end.z});
    // 		vertices.push(segment.start.x, segment.start.z, segment.end.x, segment.end.z);
    // 	})
    // });

    // console.info(this.vertices, vertices);

    // let earcut = new Earcut(vertices, [], 2);
    // this.faces = earcut.triangles;

    // --- END EARCUT

    // --- POLY2TRI

    console.info(poly2tri);
    var contour: poly2tri.Point[] = [];

    // orderedSegments.forEach(segments => {
    orderedSegments[0].forEach(segment => {
      let start = new poly2tri.Point(segment.start.x, segment.start.z);
      let end = new poly2tri.Point(segment.end.x, segment.end.z);

      for (var i = 0; i < contour.length; i++) {
        if (contour[i].x == start.x && contour[i].y == start.y) return;
      }

      contour.push(start);
    });

    try {
      var swctx = new poly2tri.SweepContext(contour);

      for (let index = 1; index < orderedSegments.length; index++) {
        const segments = orderedSegments[index];
        let hole = [];

        segments.forEach(segment => {
          hole.push(new poly2tri.Point(segment.start.x, segment.start.z));
          // hole.push(new poly2tri.Point(segment.end.x, segment.end.z));
        });

        swctx.addHole(hole);
      }

      swctx.triangulate();
      this.triangles = swctx.getTriangles();

      this.vertices = [];
      this.triangles.forEach(triangle => {
        triangle.getPoints().forEach(point => {
          this.vertices.push({ x: point.x, y: point.y });
        });
      });
    } catch (e) {
      console.error(e);
    }
    // console.info(this.vertices);

    // --- END POLY2TRI

    return orderedSegments;
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
