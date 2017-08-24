module Engine {
	export class Floor extends THREE.Group {
		private mesh: THREE.Mesh;
		private material: THREE.MeshBasicMaterial;
		private geometry: THREE.Geometry;
		private texture: THREE.DataTexture;
		private textures: Wad.Flat[];
		private graham : Graham;
		private y : number;
		// private vertices : THREE.Vector3[];
		seg: Wad.Seg;

		constructor(textures: Wad.Flat[], invert: Boolean = false) {
			super();

			this.textures = textures;
			this.graham = new Graham();

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0xFFFFFF
			});

			if (invert)
				this.material.side = THREE.BackSide;
			else
				this.material.side = THREE.BackSide;

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

		addWall(wall: WallSector) {
			let vertices: THREE.Vector3[] = wall.getVertexes();
			this.y = vertices[0].y;
			this.graham.addPoint(new THREE.Vector2(vertices[0].x, vertices[0].z));
			this.graham.addPoint(new THREE.Vector2(vertices[3].x, vertices[3].z));

			this.setTexture(wall.getFloorTexture());
		}

		private repeatedTexture(size: { width: number, height: number }) {
			let bounding = this.geometry.boundingBox;
			if (!bounding)
				return;

			// let z: number = bounding.max.z - bounding.min.z;

			let scale: number = 1;
			let width: number = bounding.max.x - bounding.min.x;
			let height: number = bounding.max.z - bounding.min.z;
			let offsetX = bounding.min.x / width;
			let offsetY = bounding.min.z / height;

			width = (width / size.width) * scale;
			height = (height / size.height) * scale;

			let result = {
				x: width,
				y: height,
				offsetX: offsetX,
				offsetY: offsetY
			};

			console.info('width', width, 'height', height, 'size', size, 'result', result);
			return result;
		}

		setTexture(name: string) {
			let texture: Wad.Flat = this.getTexture(name);

			if (texture == null) {
				console.info(name);
				return;
			}

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

			let repeated: any = this.repeatedTexture({ width: width, height: height });
			if (repeated) {
				this.texture.repeat.set(repeated.x, repeated.y);
				this.texture.offset.set(repeated.offsetX, repeated.offsetY);
			}

			// this.texture.repeat.set(2, 2);
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

		create(bounds: { uX: number, uY: number, lX: number, lY: number }) {
			if (this.graham.getPoints().length == 0){
				return;
			}

			this.geometry.vertices = [];

			if (this.graham.getPoints().length < 3){
				this.graham.addPoint(new THREE.Vector2(bounds.uX, bounds.uY));
				this.graham.addPoint(new THREE.Vector2(bounds.uX, bounds.lY));
				this.graham.addPoint(new THREE.Vector2(bounds.lX, bounds.lY));
				this.graham.addPoint(new THREE.Vector2(bounds.lX, bounds.uY));
			}
			

			let temp = this.graham.sort()
			if (temp.length == 0){
				return;
			}

			temp.forEach(point => {
				this.geometry.vertices.push(new THREE.Vector3(point.x, this.y, point.y));
			});

			// console.info(temp, this.geometry.vertices);

			this.createFaces();

			this.geometry.computeBoundingBox();
			this.geometry.computeFaceNormals();
			this.geometry.computeVertexNormals();
		}
	}
}