import * as THREE from 'three';
import * as Wad from 'wad';

import { Floor } from './floor';
import { Wall } from './wall';

export class Subsector extends THREE.Group {
  private floors: Floor[];
  private walls: Wall[];
  private textures: Wad.Textures[];
  private flats: Wad.Flat[];
  private subsector: Wad.Subsector;
  private bounds: { uX: number; uY: number; lX: number; lY: number };

  constructor(
    subsector: Wad.Subsector,
    textures: Wad.Textures[],
    flats: Wad.Flat[],
    bounds: { uX: number; uY: number; lX: number; lY: number }
  ) {
    super();
    this.flats = flats;
    this.bounds = bounds;
    this.textures = textures;
    this.walls = [];
    this.floors = [];

    this.subsector = subsector;

    var segs: Wad.Seg[] = subsector.getSegs();

    segs.forEach(seg => {
      this.add(this.createWall(seg));
    });
  }

  private createWall(seg: Wad.Seg): Wall {
    let linedef: Wad.Linedef = seg.getLinedef();
    let rightSidedef: Wad.Sidedef = linedef.getRightSidedef();
    let leftSidedef: Wad.Sidedef = linedef.getLeftSidedef();

    let startVertex: THREE.Vector2 = new THREE.Vector2(
      seg.getStartVertex().x,
      seg.getStartVertex().y
    );
    let endVertex: THREE.Vector2 = new THREE.Vector2(
      seg.getEndVertex().x,
      seg.getEndVertex().y
    );

    let wall = new Wall(this.textures);
    wall.setVertexes(startVertex, endVertex, rightSidedef, leftSidedef, seg);

    this.walls.push(wall);
    return wall;
  }
}
