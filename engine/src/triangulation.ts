import cdt2d from "cdt2d";
import * as Wad from "wad";

const compare = (
  first: { x: number; y: number },
  second: { x: number; y: number }
) => {
  return first.x === second.x && first.y === second.y;
};

const find = (array: number[][], item: number[]) => {
  for (let i = 0; i < array.length; i++) {
    let isExact = true;
    for (let i2 = 0; i2 < array[i].length; i2++) {
      if (array[i][i2] !== item[i2]) {
        isExact = false;
        break;
      }
    }

    if (isExact) {
      return i;
    }
  }
  return -1;
};

export class Triangulation {
  private points: number[][];
  private edges: number[][];

  constructor(sector: Wad.Sector) {
    this.points = [];
    this.edges = [];

    const vertices = this.reorderLinedefs(sector.getSidedefs());

    vertices.forEach(({ start, end }, index) => {
      this.points.push([start.x, start.y]);

      const indexLoop = find(this.points, [end.x, end.y]);
      if (indexLoop > -1) {
        this.edges.push([index, indexLoop]);
      } else {
        this.edges.push([index, index + 1]);
      }
    });

    // this.edges = this.points.map((_, index) => {
    //   if (index + 1 >= this.points.length) {
    //     return [index, 0];
    //   }
    //   return [index, index + 1];
    // });
  }

  private reorderLinedefs(sidedefs: Wad.Sidedef[]): {
    start: { x: number; y: number };
    end: { x: number; y: number };
  }[] {
    let vertices: {
      start: { x: number; y: number };
      end: { x: number; y: number };
    }[] = [];

    for (let i = 0; i < sidedefs.length; i++) {
      const first = sidedefs[i].getLinedef().getFirstVertex();
      const second = sidedefs[i].getLinedef().getSecondVertex();

      vertices.push({
        start: { x: first.x, y: first.y },
        end: { x: second.x, y: second.y },
      });
    }

    for (let i = 0; i < vertices.length - 1; i++) {
      for (let i2 = i + 1; i2 < vertices.length; i2++) {
        if (compare(vertices[i].end, vertices[i2].start)) {
          let temp = vertices[i + 1];
          vertices[i + 1] = vertices[i2];
          vertices[i2] = temp;
        } else if (compare(vertices[i].end, vertices[i2].end)) {
          let temp = {
            start: vertices[i2].end,
            end: vertices[i2].start,
          };

          vertices[i2] = vertices[i + 1];
          vertices[i + 1] = temp;
        }
      }
    }

    return vertices;
  }

  public generate(): { points: number[][]; cdt: number[][] } {
    // const cdt = [];
    const cdt = cdt2d(this.points, this.edges, { exterior: false });
    // console.info(this.points, this.edges, cdt);
    return { points: this.points, cdt };
  }
}
