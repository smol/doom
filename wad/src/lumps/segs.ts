import { Lump } from './lump';
import { Vertex } from './vertexes';
import { Linedef } from './linedef';

enum Angle {
  NORTH = 1,
  EAST = 2,
  SOUTH = 4,
  WEST = 8
}

export class Seg {
  private startVertex: Vertex;
  private endVertex: Vertex;
  private angleBAMS: number;
  private angle: number;
  private linedef: Linedef;
  private direction: number;
  private offset: number;

  constructor(
    offset: number,
    data: DataView,
    vertices: Vertex[],
    linedefs: Linedef[]
  ) {
    this.startVertex = vertices[data.getInt16(offset + 0, true)];
    this.endVertex = vertices[data.getInt16(offset + 2, true)];

    this.angleBAMS = data.getInt16(offset + 4, true);
    this.linedef = linedefs[data.getInt16(offset + 6, true)];
    this.direction = data.getInt16(offset + 8, true);
    this.offset = data.getInt16(offset + 10, true);

    this.linedef.setFirstVertex(vertices[this.linedef.getFirst()]);
    this.linedef.setSecondVertex(vertices[this.linedef.getSecond()]);
  }

  getStartVertex(): Vertex {
    return this.startVertex;
  }

  getEndVertex(): Vertex {
    return this.endVertex;
  }

  getLinedef(): Linedef {
    return this.linedef;
  }

  getDirection(): number {
    return this.direction;
  }
}

export class Segs extends Lump {
  private segs: Seg[];

  constructor(lump: any, data: any, vertices: Vertex[], linedefs: Linedef[]) {
    super(lump, data);

    this.segs = [];
    for (var i = 0; i < this.dataView.byteLength; i += 12) {
      this.segs.push(new Seg(i, this.dataView, vertices, linedefs));
    }
  }

  getSeg(index: number): Seg {
    // console.info(index, this.segs.length);
    return this.segs[index];
  }
}
