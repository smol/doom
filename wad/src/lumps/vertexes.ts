import { Lump } from './lump';

export class Vertexes extends Lump {
  private vertexes: Vertex[];

  constructor(lump: any, data: any) {
    super(lump, data);

    this.vertexes = [];
    for (var i = 0; i < this.dataView.byteLength; i += 4) {
      this.vertexes.push(new Vertex(lump, data, i));
    }
  }

  get(): Vertex[] {
    return this.vertexes;
  }
}

export class Vertex extends Lump {
  x: number;
  y: number;

  constructor(lump: any, data: any, offset: number) {
    super(lump, data);

    this.x = this.dataView.getInt16(offset, true);
    this.y = -this.dataView.getInt16(offset + 2, true);
  }
}
