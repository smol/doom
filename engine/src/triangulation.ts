import cdt2d from "cdt2d";
import * as Wad from "wad";

// const compare = (
//   first: { x: number; y: number },
//   second: { x: number; y: number }
// ) => {
//   return first.x === second.x && first.y === second.y;
// };

const find = (array: number[][], item: number[]) => {
  for (let i = array.length - 1; i >= 0; i--) {
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

    const vertices = sector.vertices;

    vertices.forEach(({ start, end }, index) => {
      // this.points.push();
      if (find(this.points, [start.x, start.y]) === -1) {
        this.points.push([start.x, start.y]);
      }

      // const indexLoop = find(this.points, [end.x, end.y]);
      // if (indexLoop > -1) {
      //   console.info(indexLoop, index, start, end);
      //   this.edges.push([index, indexLoop]);
      // } else {
      //   this.edges.push([index, index + 1 >= vertices.length ? 0 : index + 1]);
      // }
    });

    vertices.forEach(({ start, end }) => {
      const startIndex = find(this.points, [start.x, start.y]);
      const endIndex = find(this.points, [end.x, end.y]);
      this.edges.push([startIndex, endIndex]);
    });

    // this.points.push([vertices[0].start.x, vertices[0].start.y]);
    // this.points.push([this.points.length, 0]);

    // console.info("---- VERTICES");
    // vertices.forEach(({ start, end }, index) => {
    //   console.info(index, `${start.x}:${start.y}`, `${end.x}:${end.y}`);
    // });

    // console.info(this.points, this.edges);

    // console.info(vertices, this.edges);

    // this.edges = this.points.map((_, index) => {
    //   if (index + 1 >= this.points.length) {
    //     return [index, 0];
    //   }
    //   return [index, index + 1];
    // });
  }

  // private reorderLinedefs(sidedefs: Wad.Sidedef[]): {
  //   start: { x: number; y: number };
  //   end: { x: number; y: number };
  // }[] {
  //   let vertices: {
  //     start: { x: number; y: number };
  //     end: { x: number; y: number };
  //   }[] = [];

  //   for (let i = 0; i < sidedefs.length; i++) {
  //     const first = sidedefs[i].getLinedef().getFirstVertex();
  //     const second = sidedefs[i].getLinedef().getSecondVertex();

  //     vertices.push({
  //       start: { x: first.x, y: first.y },
  //       end: { x: second.x, y: second.y },
  //     });
  //   }

  //   for (let i = 0; i < vertices.length - 1; i++) {
  //     for (let i2 = i + 1; i2 < vertices.length; i2++) {
  //       if (compare(vertices[i].end, vertices[i2].start)) {
  //         let temp = vertices[i + 1];
  //         vertices[i + 1] = vertices[i2];
  //         vertices[i2] = temp;
  //       } else if (compare(vertices[i].end, vertices[i2].end)) {
  //         let temp = {
  //           start: vertices[i2].end,
  //           end: vertices[i2].start,
  //         };

  //         vertices[i2] = vertices[i + 1];
  //         vertices[i + 1] = temp;
  //       }
  //     }
  //   }

  //   return vertices;
  // }

  public generate(): { points: number[][]; cdt: number[][] } {
    let cdt = [];
    try {
      cdt = cdt2d(this.points, this.edges, { exterior: false });
    } catch (e) {
      console.warn(e);
    }
    // console.info(cdt);
    return { points: this.points, cdt };
  }
}
