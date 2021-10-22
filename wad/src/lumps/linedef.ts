import { Lump } from "./lump";
import { Sidedef } from "./sidedefs";
import { Vertex } from "./vertexes";

export class Linedefs extends Lump {
  private linedefs: Linedef[];

  constructor(lump: any, data: any) {
    super(lump, data);

    this.linedefs = [];

    for (var i = 0; i < this.dataView.byteLength; i += 14) {
      const linedef = new Linedef(lump, data, i);
      linedef.setIndex(this.linedefs.length);
      this.linedefs.push(linedef);
    }
  }

  get(): Linedef[] {
    return this.linedefs;
  }
}

export enum LinedefFlag {
  Impassible = 0,
  BlockMonsters = 1,
  TwoSided = 2,
  Upper = 3,
  Lower = 4,
  Secret = 5,
  BlockSound = 6,
  NotOnMap = 7,
  AlreayOnMap = 8,
}

export class Linedef extends Lump {
  private firstVertexIndex: number;
  private secondVertexIndex: number;
  private flagsIndex: number;
  private types: number;
  private tag: number;
  private right: number;
  private left: number;
  private flag: LinedefFlag;
  private rightSidedef: Sidedef;
  private leftSidedef: Sidedef;
  private index: number = 0;

  private firstVertex: Vertex;
  private secondVertex: Vertex;

  constructor(lump: any, data: any, offset: number) {
    super(lump, data);

    this.firstVertexIndex = this.dataView.getInt16(offset, true);
    this.secondVertexIndex = this.dataView.getInt16(offset + 2, true);
    this.flagsIndex = this.dataView.getInt16(offset + 4, true);
    this.types = this.dataView.getInt16(offset + 6, true);
    this.tag = this.dataView.getInt16(offset + 8, true);
    this.right = this.dataView.getInt16(offset + 10, true);
    this.left = this.dataView.getInt16(offset + 12, true);

    this.flag = LinedefFlag[LinedefFlag[this.flagsIndex]];

    // console.warn('linedefs', firstVertexIndex, secondVertexIndex, flagsString, types, tag, right, left);
  }

  setIndex(index: number) {
    this.index = index;
  }

  getIndex() {
    return this.index;
  }

  setSidedef(rightSidedef: Sidedef, leftSidedef: Sidedef) {
    rightSidedef.setLinedef(this);

    if (leftSidedef) leftSidedef.setLinedef(this);

    this.rightSidedef = rightSidedef;
    this.leftSidedef = leftSidedef;
  }

  setFirstVertex(vertex: Vertex) {
    this.firstVertex = vertex;
  }

  setSecondVertex(vertex: Vertex) {
    this.secondVertex = vertex;
  }

  getFirstVertex(): Vertex {
    return this.firstVertex;
  }

  getSecondVertex(): Vertex {
    return this.secondVertex;
  }

  getRightSidedef(): Sidedef {
    return this.rightSidedef;
  }

  getLeftSidedef(): Sidedef {
    return this.leftSidedef;
  }

  getRight(): number {
    return this.right;
  }

  getLeft(): number {
    return this.left;
  }

  getFirst(): number {
    return this.firstVertexIndex;
  }

  getSecond(): number {
    return this.secondVertexIndex;
  }

  getFlag(): LinedefFlag {
    return this.flag;
  }

  getSectorTag(): number {
    return this.tag;
  }
}
