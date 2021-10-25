import * as THREE from "three";
import * as Wad from "wad";
import { Triangulation } from "./triangulation";

import { Floor } from "./floor";

export class Sector extends THREE.Group {
  private floor: Floor;

  constructor(sector: Wad.Sector, flats: Wad.Flat[]) {
    super();

    let triangulation = new Triangulation(sector);
    const { points, cdt } = triangulation.generate();

    let floor = new Floor(flats);
    let lower = new Floor(flats, true);

    floor.setPoints(points, sector.getFloorHeight(), cdt);
    lower.setPoints(points, sector.getCeilingHeight(), cdt);

    // sector.getSidedefs().forEach((sidedef) => {
    //   const linedef = sidedef.getLinedef();
    //   // floor.addWall(
    //   //   linedef,
    //   //   sector.getFloorHeight(),
    //   //   sector.getFloorTextureName()
    //   // );

    //   // lower.addWall(
    //   //   linedef,
    //   //   sector.getCeilingHeight(),
    //   //   sector.getCeilingTextureName()
    //   // );
    // });

    try {
      lower.create();

      floor.create();
    } catch (e) {
      console.info(sector);
    }
    floor.setTexture(sector.getFloorTextureName());
    lower.setTexture(sector.getCeilingTextureName());
    this.add(floor);
    this.add(lower);

    this.floor = floor;

    // this.floors.push(floor);
    // this.floors.push(lower);
  }

  getFloor() {
    return this.floor;
  }
}
