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

		private createFaces() {
			for (var i = 0; i < this.geometry.vertices.length; i++) {
				if (i > 1)
					this.geometry.faces.push(new THREE.Face3(0, i - 1, i));
			}
		}

		addVertex(vertex : THREE.Vector3){
			this.geometry.vertices.push(vertex);
		}

		create() {
			// this.walls.forEach(wall => {
			// 	// wall.getLowerVertexes();

			// 	let lowerVertices : THREE.Vector3[] = wall.getLowerVertexes();

			// 	if (lowerVertices.length > 1)
			// 		this.geometry.vertices.push(lowerVertices[0]);

			// });

			this.createFaces();

			this.geometry.computeFaceNormals();
			this.geometry.computeVertexNormals();

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.add(this.mesh);
		}
	}
}