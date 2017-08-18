module Engine {
	export class Floor extends THREE.Group {
		private mesh: THREE.Mesh;
		private material: THREE.MeshBasicMaterial;
		private geometry: THREE.Geometry;
		private texture: THREE.DataTexture;
		private textures: Wad.Flat[];
		seg: Wad.Seg;

		constructor(textures: Wad.Flat[]) {
			super();

			this.textures = textures;

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0xFFFFFF
			});

			this.material.side = THREE.DoubleSide;
			this.material.needsUpdate = true;
			this.geometry = new THREE.Geometry();

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.add(this.mesh);
		}

		private createFaces() {
			for (var i = 0; i < this.geometry.vertices.length; i++) {
				if (i > 1)
					this.geometry.faces.push(new THREE.Face3(0, i - 1, i));
			}

			this.geometry.faceVertexUvs[0] = [];
			this.geometry.faceVertexUvs[0].push([
				new THREE.Vector2(0, 0),
				new THREE.Vector2(0, 1),
				new THREE.Vector2(1, 1),
			]);

			this.geometry.faceVertexUvs[0].push([
				new THREE.Vector2(0, 0),
				new THREE.Vector2(1, 1),
				new THREE.Vector2(1, 0),
			]);
		}

		addVertex(vertex: THREE.Vector3) {
			this.geometry.vertices.push(vertex);
		}

		setTexture(name: string) {
			let texture: Wad.Flat = this.getTexture(name);

			if (texture == null) {
				console.info(name);
				return;
			}
			// console.info(texture);

			const pixelData = [];
			var width = texture.getWidth();
			var height = texture.getHeight();

			function isPowerOf2(value) {
				return (value & (value - 1)) == 0;
			}

			let wrapping: THREE.Wrapping = THREE.RepeatWrapping;

			// if (isPowerOf2(width) && isPowerOf2(height))
			// 	wrapping = THREE.RepeatWrapping;


			var data: Uint8Array = Uint8Array.from(texture.getImageData());
			this.texture = new THREE.DataTexture(data, width, height,
				THREE.RGBAFormat,
				THREE.UnsignedByteType,
				THREE.UVMapping,
				wrapping,
				wrapping,
				THREE.NearestFilter,
				THREE.LinearFilter,
				16,
				THREE.LinearEncoding
			);
			this.texture.needsUpdate = true;

			// this.material = new THREE.MeshBasicMaterial({
			// 	transparent: true,
			// 	map: this.texture,
			// 	// color: 0xFF0000
			// });

			// this.material.side = THREE.DoubleSide;

			// this.material.needsUpdate = true;
			(this.mesh.material as THREE.MeshBasicMaterial).map = this.texture;
		}

		private getTexture(name: string): Wad.Flat {
			for (var t = 0; t < this.textures.length; t++) {
				if (this.textures[t].getName() == name) {
					return this.textures[t];
				}
			}

			return null;
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


		}
	}
}