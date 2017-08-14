module Engine {
	export class Floor extends THREE.Group {
		private mesh: THREE.Mesh;
		private material: THREE.MeshBasicMaterial;
		private geometry: THREE.Geometry;
		private textures: Wad.Textures[];
		
		seg : Wad.Seg;

		constructor(textures: Wad.Textures[]) {
			super();

			this.textures = textures;

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0x00FF00
			});

			this.material.side = THREE.DoubleSide;
			this.material.needsUpdate = true;
			this.geometry = new THREE.Geometry();
		}

		addSeg(seg: Wad.Seg) {
			this.seg = seg;
			let linedef: Wad.Linedef = seg.getLinedef();
			let rightSidedef: Wad.Sidedef = linedef.getRightSidedef();
			let leftSidedef: Wad.Sidedef = linedef.getLeftSidedef();

			this.createVertexes(rightSidedef, linedef);

			let wall: Engine.Wall = this.createWall(seg, rightSidedef, leftSidedef);
			

		}

		

		private createVertexes(sidedef: Wad.Sidedef, linedef: Wad.Linedef) {


		}

		private createWall(seg: Wad.Seg, rightSidedef: Wad.Sidedef, leftSidedef: Wad.Sidedef): Engine.Wall {
			let wall = new Engine.Wall(this.textures);

			let startVertex: THREE.Vector2 = new THREE.Vector2(seg.getStartVertex().x, seg.getStartVertex().y);
			let endVertex: THREE.Vector2 = new THREE.Vector2(seg.getEndVertex().x, seg.getEndVertex().y);

			wall.setVertexes(startVertex, endVertex, rightSidedef, leftSidedef);
			this.add(wall);

			return wall;
		}

		private createFaces() {
			for (var i = 0; i < this.geometry.vertices.length; i++) {
				if (i > 1)
					this.geometry.faces.push(new THREE.Face3(0, i - 1, i));
			}
		}

		create() {
			this.createFaces();

			this.geometry.computeFaceNormals();
			this.geometry.computeVertexNormals();

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.add(this.mesh);
		}
	}
}