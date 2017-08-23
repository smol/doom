module Engine {
	export class Sector extends THREE.Group {
		private floors: Floor[];
		private walls: Wall[];
		private textures: Wad.Textures[];
		private flats: Wad.Flat[];
		private subsector: Wad.Subsector;
		private bounds: { uX: number; uY: number; lX: number; lY: number; };

		constructor(subsector: Wad.Subsector, textures: Wad.Textures[], flats: Wad.Flat[], bounds: { uX: number; uY: number; lX: number; lY: number; }) {
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

			this.createFloor();
		}

		private createFloor() {
			/// get the wall left
			/// get the wall right

			// console.info('CREATE FLOOR');


			// new THREE.Vector3(firstVertex.x / 5, lowerFloorHeight / 5, firstVertex.y / 5),
			// new THREE.Vector3(firstVertex.x / 5, lowerCeilingHeight / 5, firstVertex.y / 5),
			// new THREE.Vector3(secondVertex.x / 5, lowerCeilingHeight / 5, secondVertex.y / 5),
			// new THREE.Vector3(secondVertex.x / 5, lowerFloorHeight / 5, secondVertex.y / 5),


			let floor = new Floor(this.flats);
			let lower = new Floor(this.flats);


			this.walls.forEach(wall => {

				
				let middleSector: WallSector = wall.getMiddleSector();
				let lowerSector: WallSector = wall.getLowerSector();
				let upperVertices: THREE.Vector3[] = wall.getUpperVertexes();

				if (middleSector) {

					// console.info('WALL');

					floor.addWall(middleSector);


				}

				if (lowerSector){
					lower.addWall(lowerSector);
				}

				// if (lowerVertices.length > 0){
				// 	let floor = new Floor(this.flats);
				// 	floor.addVertex(new THREE.Vector3(this.bounds.uX / 2, lowerVertices[0].y, this.bounds.uY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.uX / 2, lowerVertices[0].y, this.bounds.lY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.lX / 2, lowerVertices[0].y, this.bounds.lY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.lX / 2, lowerVertices[0].y, this.bounds.uY / 2));
				// 	floor.create();
				// 	floor.setTexture(wall.getFloorTexture());
				// 	this.add(floor);
				// 	this.floors.push(floor);
				// }

				// if (upperVertices.length > 0){
				// 	let floor = new Floor(this.flats, true);
				// 	floor.addVertex(new THREE.Vector3(this.bounds.uX / 2, upperVertices[0].y, this.bounds.uY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.uX / 2, upperVertices[0].y, this.bounds.lY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.lX / 2, upperVertices[0].y, this.bounds.lY / 2));
				// 	floor.addVertex(new THREE.Vector3(this.bounds.lX / 2, upperVertices[0].y, this.bounds.uY / 2));
				// 	floor.create();
				// 	floor.setTexture(wall.getCeilingTexture());
				// 	this.add(floor);
				// 	this.floors.push(floor);
				// }

				// if (lowerVertices.length > 0 && middleVertices.length > 0) {
				// 	let middleFloor = new Floor(this.textures);

				// 	middleFloor.addVertex(middleVertices[0]);
				// 	middleFloor.addVertex(lowerVertices[1]);
				// 	middleFloor.addVertex(lowerVertices[2]);
				// 	middleFloor.addVertex(middleVertices[3]);

				// 	middleFloor.create();

				// 	this.add(middleFloor);
				// 	this.floors.push(middleFloor);
				// }
			});

			lower.create(this.bounds);

			floor.create(this.bounds);
			// floor.setTexture(wall.getFloorTexture());
			this.add(floor);
			this.add(lower);
			this.floors.push(floor);
			this.floors.push(lower);

			// console.info('END CREATE FLOOR');

			// this.floor.create();
		}

		private createWall(seg: Wad.Seg): Engine.Wall {
			let linedef: Wad.Linedef = seg.getLinedef();
			let rightSidedef: Wad.Sidedef = linedef.getRightSidedef();
			let leftSidedef: Wad.Sidedef = linedef.getLeftSidedef();

			let startVertex: THREE.Vector2 = new THREE.Vector2(seg.getStartVertex().x, seg.getStartVertex().y);
			let endVertex: THREE.Vector2 = new THREE.Vector2(seg.getEndVertex().x, seg.getEndVertex().y);

			let wall = new Engine.Wall(this.textures);
			wall.setVertexes(startVertex, endVertex, rightSidedef, leftSidedef, seg);

			this.walls.push(wall);
			return wall;
		}
	}
}