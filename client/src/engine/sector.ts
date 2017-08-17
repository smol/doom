module Engine {
	export class Sector {
		private floors : Floor[];
		private walls: Wall[];
		private textures: Wad.Textures[];
		private scene : THREE.Scene;

		constructor(subsector: Wad.Subsector, textures: Wad.Textures[], scene: THREE.Scene) {
			this.textures = textures;
			this.walls = [];
			this.floors = [];
			this.scene = scene;

			var segs: Wad.Seg[] = subsector.getSegs();

			if (segs.length > 1) {
				// this.floor = new Engine.Floor(textures);
				// scene.add(this.floor);

				for (var i = 0; i < segs.length; i++) {
					scene.add(this.createWall(segs[i]));
				}

				this.createFloor();	
			}
		}

		private createFloor() {
			this.walls.forEach(wall => {
				let middleVertices : THREE.Vector3[] = wall.getMiddleVertexes();
				let lowerVertices : THREE.Vector3[] = wall.getLowerVertexes();
				let upperVertices : THREE.Vector3[] = wall.getUpperVertexes();

				if (lowerVertices.length > 1 && middleVertices.length > 1){
					let middleFloor = new Floor(this.textures);

					middleFloor.addVertex(middleVertices[0]);
					middleFloor.addVertex(lowerVertices[1]);
					middleFloor.addVertex(lowerVertices[2]);
					middleFloor.addVertex(middleVertices[3]);
					
					middleFloor.create();

					this.scene.add(middleFloor);
					this.floors.push(middleFloor);
				}
			});

			// this.floor.create();
		}

		private createWall(seg: Wad.Seg): Engine.Wall {
			let linedef: Wad.Linedef = seg.getLinedef();
			let rightSidedef: Wad.Sidedef = linedef.getRightSidedef();
			let leftSidedef: Wad.Sidedef = linedef.getLeftSidedef();
			let wall = new Engine.Wall(this.textures);

			let startVertex: THREE.Vector2 = new THREE.Vector2(seg.getStartVertex().x, seg.getStartVertex().y);
			let endVertex: THREE.Vector2 = new THREE.Vector2(seg.getEndVertex().x, seg.getEndVertex().y);

			wall.setVertexes(startVertex, endVertex, rightSidedef, leftSidedef);

			this.walls.push(wall);
			return wall;
		}
	}
}