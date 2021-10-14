import * as Engine from 'engine';
import * as Wad from 'wad';

const untypedSegment = [
  [
    { start: { x: 128, y: 2, z: 96 }, end: { x: 128, y: 2, z: 320 } },
    { start: { x: 640, y: 2, z: 96 }, end: { x: 128, y: 2, z: 96 } },
    { start: { x: -128, y: 2, z: 320 }, end: { x: -128, y: 2, z: 96 } },
    { start: { x: -128, y: 2, z: 96 }, end: { x: -360, y: 2, z: 96 } },
    { start: { x: -680, y: 2, z: -128 }, end: { x: -704, y: 2, z: -304 } },
    { start: { x: 192, y: 2, z: 0 }, end: { x: -192, y: 2, z: 0 } },
    { start: { x: -320, y: 2, z: -64 }, end: { x: -320, y: 2, z: -192 } },
    { start: { x: 320, y: 2, z: -192 }, end: { x: 320, y: 2, z: -64 } },
    { start: { x: 640, y: 2, z: -320 }, end: { x: 640, y: 2, z: -128 } },
    { start: { x: -320, y: 2, z: -448 }, end: { x: -320, y: 2, z: -192 } },
    { start: { x: -320, y: 2, z: -448 }, end: { x: -704, y: 2, z: -304 } },
    { start: { x: -704, y: 2, z: -304 }, end: { x: -704, y: 2, z: -464 } },
    { start: { x: 320, y: 2, z: -320 }, end: { x: 640, y: 2, z: -320 } },
    { start: { x: -360, y: 2, z: 96 }, end: { x: -520, y: 2, z: -64 } },
    { start: { x: -704, y: 2, z: -64 }, end: { x: -680, y: 2, z: -128 } },
    { start: { x: -520, y: 2, z: -64 }, end: { x: -576, y: 2, z: -64 } },
    { start: { x: -576, y: 2, z: -64 }, end: { x: -704, y: 2, z: -64 } },
    { start: { x: 128, y: 2, z: 320 }, end: { x: 32, y: 2, z: 320 } },
    { start: { x: -32, y: 2, z: 320 }, end: { x: -128, y: 2, z: 320 } },
    { start: { x: 32, y: 2, z: 320 }, end: { x: -32, y: 2, z: 320 } },
    { start: { x: 832, y: 2, z: -64 }, end: { x: 832, y: 2, z: 64 } },
    { start: { x: 320, y: 2, z: -64 }, end: { x: 192, y: 2, z: -64 } },
    { start: { x: 192, y: 2, z: -64 }, end: { x: 192, y: 2, z: 0 } },
    { start: { x: -192, y: 2, z: 0 }, end: { x: -192, y: 2, z: -64 } },
    { start: { x: -192, y: 2, z: -64 }, end: { x: -320, y: 2, z: -64 } },
    { start: { x: 640, y: 2, z: -128 }, end: { x: 808, y: 2, z: -64 } },
    { start: { x: 808, y: 2, z: 64 }, end: { x: 640, y: 2, z: 96 } },
    { start: { x: 832, y: 2, z: 64 }, end: { x: 808, y: 2, z: 64 } },
    { start: { x: 808, y: 2, z: -64 }, end: { x: 832, y: 2, z: -64 } },
    { start: { x: 320, y: 2, z: -192 }, end: { x: 320, y: 2, z: -256 } },
    { start: { x: 320, y: 2, z: -256 }, end: { x: 320, y: 2, z: -320 } },
    { start: { x: 464, y: 2, z: 0 }, end: { x: 496, y: 2, z: 0 } },
    { start: { x: 496, y: 2, z: 0 }, end: { x: 512, y: 2, z: -16 } },
    { start: { x: 512, y: 2, z: -16 }, end: { x: 512, y: 2, z: -48 } },
    { start: { x: 512, y: 2, z: -48 }, end: { x: 496, y: 2, z: -64 } },
    { start: { x: 496, y: 2, z: -64 }, end: { x: 464, y: 2, z: -64 } },
    { start: { x: 464, y: 2, z: -64 }, end: { x: 448, y: 2, z: -48 } },
    { start: { x: 448, y: 2, z: -48 }, end: { x: 448, y: 2, z: -16 } },
    { start: { x: 448, y: 2, z: -16 }, end: { x: 464, y: 2, z: 0 } },
    { start: { x: -720, y: 2, z: -320 }, end: { x: -720, y: 2, z: -448 } },
    { start: { x: -720, y: 2, z: -448 }, end: { x: -720, y: 2, z: -464 } },
    { start: { x: -720, y: 2, z: -464 }, end: { x: -704, y: 2, z: -464 } },
    { start: { x: -704, y: 2, z: -304 }, end: { x: -720, y: 2, z: -304 } },
    { start: { x: -720, y: 2, z: -304 }, end: { x: -720, y: 2, z: -320 } }
  ],
  [
    { start: { x: 2888, y: 0, z: 4320 }, end: { x: 2888, y: 0, z: 4352 } },
    { start: { x: 2888, y: 0, z: 4352 }, end: { x: 2912, y: 0, z: 4352 } },
    { start: { x: 2888, y: 0, z: 4352 }, end: { x: 2856, y: 0, z: 4352 } },
    { start: { x: 2856, y: 0, z: 4352 }, end: { x: 2856, y: 0, z: 4160 } },
    { start: { x: 2856, y: 0, z: 4160 }, end: { x: 2888, y: 0, z: 4160 } },
    { start: { x: 2888, y: 0, z: 4160 }, end: { x: 2888, y: 0, z: 4192 } },
    { start: { x: 2888, y: 0, z: 4192 }, end: { x: 2888, y: 0, z: 4320 } },
    { start: { x: 2888, y: 0, z: 4160 }, end: { x: 2912, y: 0, z: 4160 } },
    { start: { x: 2912, y: 0, z: 4160 }, end: { x: 3104, y: 0, z: 4160 } },
    { start: { x: 3104, y: 0, z: 4160 }, end: { x: 3128, y: 0, z: 4160 } },
    { start: { x: 3128, y: 0, z: 4160 }, end: { x: 3160, y: 0, z: 4160 } },
    { start: { x: 3160, y: 0, z: 4160 }, end: { x: 3160, y: 0, z: 4352 } },
    { start: { x: 3160, y: 0, z: 4352 }, end: { x: 3128, y: 0, z: 4352 } },
    { start: { x: 3128, y: 0, z: 4160 }, end: { x: 3128, y: 0, z: 4192 } },
    { start: { x: 3128, y: 0, z: 4192 }, end: { x: 3128, y: 0, z: 4320 } },
    { start: { x: 3128, y: 0, z: 4320 }, end: { x: 3128, y: 0, z: 4352 } },
    { start: { x: 3128, y: 0, z: 4352 }, end: { x: 3104, y: 0, z: 4352 } },
    { start: { x: 3104, y: 0, z: 4352 }, end: { x: 2912, y: 0, z: 4352 } }
  ],
  [
    { start: { x: 1184, y: 0, z: 3360 }, end: { x: 1184, y: 0, z: 3392 } },
    { start: { x: 1184, y: 0, z: 3392 }, end: { x: 928, y: 0, z: 3392 } },
    { start: { x: 928, y: 0, z: 3392 }, end: { x: 928, y: 0, z: 3360 } },
    { start: { x: 928, y: 0, z: 3360 }, end: { x: 1184, y: 0, z: 3360 } },
    { start: { x: 896, y: 0, z: 3104 }, end: { x: 928, y: 0, z: 3104 } },
    { start: { x: 928, y: 0, z: 3104 }, end: { x: 928, y: 0, z: 3072 } },
    { start: { x: 928, y: 0, z: 3072 }, end: { x: 1184, y: 0, z: 3072 } },
    { start: { x: 928, y: 0, z: 3104 }, end: { x: 1184, y: 0, z: 3104 } },
    { start: { x: 1184, y: 0, z: 3104 }, end: { x: 1184, y: 0, z: 3072 } },
    { start: { x: 928, y: 0, z: 3104 }, end: { x: 928, y: 0, z: 3360 } },
    { start: { x: 928, y: 0, z: 3360 }, end: { x: 896, y: 0, z: 3360 } },
    { start: { x: 896, y: 0, z: 3360 }, end: { x: 896, y: 0, z: 3104 } }
  ]
];

const clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(values: { x: number; y: number; z: number }) {
    this.x = values.x;
    this.y = values.y;
    this.z = values.z;
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  angleTo(v: Vector3): number {
    var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());

    // clamp, to handle numerical problems
    return Math.acos(clamp(theta, -1, 1));
  }

  sub(second: Vector3) {
    return new Vector3({
      x: this.x - second.x,
      y: this.y - second.y,
      z: this.z - second.z
    });
  }

  equals(to: Vector3): boolean {
    return this.x === to.x && this.y === to.y && this.z === to.z;
  }

  toString(): string {
    return `x: ${this.x}, z: ${this.z}`;
  }
}

export default class Debug {
  private context: CanvasRenderingContext2D;
  private position: { x: number; z: number };
  private scale: number;

  constructor() {
    // sector.getSidedefs().forEach(sidedef => {
    //   const linedef = sidedef.getLinedef();

    //   what.addLinedef(linedef, 2);
    // });
    // wtf.orderGraph(segments);
    // const orderedSegments = wtf.getSegments();

    this.scale = 0.5;
    // this.position = { x: -2800, z: -4120 };
    this.position = { x: -500, z: -3000 };
    // this.position = { x: 800, z: 700 };
    // this.position = { x: 900, z: 500 };

    const canvas: HTMLCanvasElement = document.getElementById(
      'canvas'
    ) as HTMLCanvasElement;
    this.context = canvas.getContext('2d');

    untypedSegment.forEach(temp => this.parseSegment(temp));

    // console.info(orderedSegments);
    // orderedSegments[0].forEach(segment => {
    //   this.renderGraph(segment, 0);
    // });

    // this.renderSegments(orderedSegments);
    // this.render(orderedSegments);
  }

  private parseSegment(vectors: any[]) {
    const segments: Engine.Segment[] = vectors.map(
      segment =>
        new Engine.Segment(new Vector3(segment.start), new Vector3(segment.end))
    );

    // const wtf = new Engine.Wtf();
    const what: Engine.PolygonGeneration = new Engine.PolygonGeneration();
    what.addSegments(segments);
    const orderedSegments = what.start();

    console.info(orderedSegments);

    const supertriangles = what.triangles;

    supertriangles.forEach(triangles => {
      triangles.forEach(triangle => {
        let points = triangle.getPoints();

        this.renderTriangle(points[0], points[1], points[2]);
      });
    });
  }

  private renderTriangle(a, b, c) {
    this.context.beginPath();

    this.context.moveTo(
      (a.x + this.position.x) * this.scale,
      (a.y + this.position.z) * this.scale
    );
    this.context.lineTo(
      (b.x + this.position.x) * this.scale,
      (b.y + this.position.z) * this.scale
    );
    this.context.lineTo(
      (c.x + this.position.x) * this.scale,
      (c.y + this.position.z) * this.scale
    );

    this.context.fillStyle = '#00FF00';
    this.context.strokeStyle = '#FF0000';
    this.context.stroke();
    this.context.fill();

    this.context.closePath();
  }

  private renderGraph(segment: Engine.Segment, index: number) {
    const fromx: number = (segment.start.x + this.position.x) * this.scale;
    const fromy: number = (segment.start.z + this.position.z) * this.scale;

    const tox: number = (segment.end.x + this.position.x) * this.scale;
    const toy: number = (segment.end.z + this.position.z) * this.scale;

    this.renderArrow(this.context, fromx, fromy, tox, toy);
    this.renderText(index, segment.start, segment.end);

    segment.getChildren().forEach(child => {
      this.renderGraph(child, index + 1);
    });
  }

  private renderPoint2d(point: { x: number; y: number; z: number }) {
    this.context.beginPath();
    this.context.strokeStyle = '#00FF00';

    this.context.arc(
      (point.x + this.position.x) * this.scale,
      (point.z + this.position.z) * this.scale,
      5,
      0,
      2 * Math.PI
    );
    this.context.stroke();

    this.context.closePath();
  }

  private renderLine(
    from: { x: number; y: number; z: number },
    to: { x: number; y: number; z: number },
    index: number
  ) {
    this.context.beginPath();
    this.context.strokeStyle = '#FF0000';
    this.context.moveTo(
      (from.x + this.position.x) * this.scale,
      (from.z + this.position.z) * this.scale
    );

    this.context.lineTo(
      (to.x + this.position.x) * this.scale,
      (to.z + this.position.z) * this.scale
    );

    this.context.stroke();
    this.context.closePath();
  }

  private renderSegments(segmentss: Engine.Segment[][]) {
    segmentss.forEach((segments, i) => {
      (segments || []).forEach((segment, index) => {
        const fromx: number = (segment.start.x + this.position.x) * this.scale;
        const fromy: number = (segment.start.z + this.position.z) * this.scale;

        const tox: number = (segment.end.x + this.position.x) * this.scale;
        const toy: number = (segment.end.z + this.position.z) * this.scale;

        this.renderArrow(this.context, fromx, fromy, tox, toy);
        this.renderText(index, segment.start, segment.end);
        // this.renderPoint2d(segment.start);
        // this.renderPoint2d(segment.end);
      });
    });
  }

  private renderText(text, from, to) {
    this.context.font = '10px Arial';
    this.context.fillStyle = '#00FF00';
    this.context.fillText(
      `${text}`,
      (from.x + (to.x - from.x) / 2 + this.position.x) * this.scale,
      (from.z + (to.z - from.z) / 2 + this.position.z) * this.scale
    );
  }

  private renderArrow(
    context: CanvasRenderingContext2D,
    fromx: number,
    fromy: number,
    tox: number,
    toy: number
  ) {
    var headlen = 10; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    this.context.beginPath();
    this.context.strokeStyle = '#FF0000';
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.context.stroke();
    this.context.closePath();
  }

  private renderPoint(point: Engine.Point) {
    this.renderPoint2d(point.position);

    point.linked.forEach((subpoint, index) => {
      this.renderLine(point.position, subpoint.position, index);

      this.renderPoint(subpoint);
    });
  }

  render(points: Engine.Point[]) {
    points.forEach(point => {
      this.renderPoint(point);
    });
  }
}
