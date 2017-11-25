module Engine {
	export class Sector extends THREE.Group {
		private flats: Wad.Flat[];
		private sidedefs: Wad.Sidedef[];


		constructor(sector: Wad.Sector, flats: Wad.Flat[]) {
			super();

			this.flats = flats;
			this.sidedefs = sector.getSidedefs();

			if (this.sidedefs.length == 0) {
				return;
			}

			let floor = new Floor(this.flats);
			let lower = new Floor(this.flats, true);

			this.sidedefs.forEach(sidedef => {
				floor.addWall(sidedef.getLinedef(), sector.getFloorHeight(), sector.getFloorTextureName());
				lower.addWall(sidedef.getLinedef(), sector.getCeilingHeight(), sector.getCeilingTextureName());
			});

			lower.create();

			floor.create();
			// floor.setTexture(wall.getFloorTexture());
			this.add(floor);
			this.add(lower);

			// this.floors.push(floor);
			// this.floors.push(lower);
		}
	}
}