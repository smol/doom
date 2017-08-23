/// <reference path="../../../node_modules/@types/three/index.d.ts" />

module Engine {
	export class WallSector extends THREE.Group {
		private geometry: THREE.Geometry;
		private mesh: THREE.Mesh;
		private material: THREE.Material;
		private texture: THREE.DataTexture;
		private textureNames: { floor: string, ceiling: string }

		constructor(vertices: THREE.Vector3[], direction: number, textureNames: { floor: string, ceiling: string }) {
			super();

			this.textureNames = textureNames;

			this.geometry = new THREE.Geometry();
			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				// color: 0x002200
			});

			// if (direction === 0)
			// 	this.material.side = THREE.FrontSide;
			// else
			// 	this.material.side = THREE.BackSide;
			this.material.side = THREE.DoubleSide;

			this.material.needsUpdate = true;

			vertices.forEach(vertex => {
				this.geometry.vertices.push(vertex);
			});


			this.geometry.faces.push(new THREE.Face3(0, 1, 2));
			this.geometry.faces.push(new THREE.Face3(0, 2, 3));

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

			this.geometry.computeBoundingBox();
			this.geometry.computeFaceNormals();
			this.geometry.computeVertexNormals();
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.add(this.mesh);
		}

		private repeatedTexture(size: { width: number, height: number }) {
			let bounding = this.geometry.boundingBox;

			let z: number = bounding.max.z - bounding.min.z;
			let x: number = bounding.max.x - bounding.min.x;

			let scale : number = 1;
			let width: number = Math.sqrt((x * x) + (z * z));
			let height: number = bounding.max.y - bounding.min.y;
			let result = { x: (width / size.width) * scale, y: (height / size.height) * scale }
			// console.info('width', width, 'height', height, 'size', size, 'result', result);
			return result;
		}

		setTexture(texture: Wad.Graphic) {
			if (texture == null) {
				return;
			}
			// console.info(texture.getName(), texture.getWidth(), texture.getHeight());

			const pixelData = [];
			var width = texture.getWidth();
			var height = texture.getHeight();

			function isPowerOf2(value) {
				return (value & (value - 1)) == 0;
			}

			let wrapping: THREE.Wrapping = THREE.ClampToEdgeWrapping;

			if (isPowerOf2(width) && isPowerOf2(height))
				wrapping = THREE.RepeatWrapping;


			var data: Uint8Array = Uint8Array.from(texture.getImageData());

			this.texture = new THREE.DataTexture(data, width, height,
				THREE.RGBAFormat,
				THREE.UnsignedByteType,
				THREE.UVMapping,
				wrapping,
				wrapping,
				THREE.NearestFilter,
				THREE.NearestFilter,
				16,
				THREE.LinearEncoding
			);

			// let repeated: any = this.repeatedTexture({ width: width, height: height });

			// this.texture.repeat.set(repeated.x, repeated.y);

			this.texture.needsUpdate = true;

			// this.material = new THREE.MeshBasicMaterial({
			// 	transparent: true,
			// 	map: this.texture,
			// 	// color: 0xFF0000
			// });

			// this.material.side = THREE.DoubleSide;

			// this.material.needsUpdate = true;
			(this.mesh.material as THREE.MeshBasicMaterial).map = this.texture;



			// geom.vertices.push(
			// 	new THREE.Vector3(0, 0, 0),
			// 	new THREE.Vector3(0, -500, 0),
			// 	new THREE.Vector3(0, -500, 500),
			// 	new THREE.Vector3(0, 0, 500),
			// );


		}

		getFloorTexture(): string {
			return this.textureNames.floor;
		}

		getCeilingTexture() : string {
			return this.textureNames.ceiling;
		}

		getVertexes(): THREE.Vector3[] {
			return this.geometry.vertices;
		}
	}

	export class Wall extends THREE.Group {
		private textures: Wad.Textures[];
		private lowerSector: WallSector;
		private upperSector: WallSector;
		private middleSector: WallSector;

		constructor(textures: Wad.Textures[]) {
			super();
			this.textures = textures;
		}

		setVertexes(firstVertex: THREE.Vector2, secondVertex: THREE.Vector2, rightSidedef: Wad.Sidedef, leftSidedef: Wad.Sidedef, seg: Wad.Seg) {
			let rightSector: Wad.Sector = rightSidedef.getSector();

			if (leftSidedef) {
				let leftSector: Wad.Sector = leftSidedef.getSector();
				let upperFloorHeight = leftSidedef.getSector().getCeilingHeight();
				let upperCeilingHeight = rightSidedef.getSector().getCeilingHeight();
				let lowerFloorHeight = rightSidedef.getSector().getFloorHeight();
				let lowerCeilingHeight = leftSidedef.getSector().getFloorHeight();

				this.lowerSector = new WallSector([
					new THREE.Vector3(firstVertex.x, lowerFloorHeight, firstVertex.y),
					new THREE.Vector3(firstVertex.x, lowerCeilingHeight, firstVertex.y),
					new THREE.Vector3(secondVertex.x, lowerCeilingHeight, secondVertex.y),
					new THREE.Vector3(secondVertex.x, lowerFloorHeight, secondVertex.y),
				], seg.getDirection(), { floor: rightSector.getFloorTextureName(), ceiling: leftSector.getCeilingTextureName() });

				this.add(this.lowerSector);

				this.lowerSector.setTexture(this.getTexture(rightSidedef.getLower()));

				this.upperSector = new WallSector([
					new THREE.Vector3(firstVertex.x, upperFloorHeight, firstVertex.y),
					new THREE.Vector3(firstVertex.x, upperCeilingHeight, firstVertex.y),
					new THREE.Vector3(secondVertex.x, upperCeilingHeight, secondVertex.y),
					new THREE.Vector3(secondVertex.x, upperFloorHeight, secondVertex.y),
				], seg.getDirection(), { floor: leftSector.getFloorTextureName(), ceiling: rightSector.getCeilingTextureName() });

				this.add(this.upperSector);

				this.upperSector.setTexture(this.getTexture(rightSidedef.getUpper()));
			} else {
				let ceilingHeight = rightSidedef.getSector().getCeilingHeight();
				let floorHeight = rightSidedef.getSector().getFloorHeight();

				this.middleSector = new WallSector([
					new THREE.Vector3(firstVertex.x, floorHeight, firstVertex.y),
					new THREE.Vector3(firstVertex.x, ceilingHeight, firstVertex.y),
					new THREE.Vector3(secondVertex.x, ceilingHeight, secondVertex.y),
					new THREE.Vector3(secondVertex.x, floorHeight, secondVertex.y),
				], seg.getDirection(), { floor: rightSector.getFloorTextureName(), ceiling: rightSector.getCeilingTextureName() });

				this.add(this.middleSector);

				this.middleSector.setTexture(this.getTexture(rightSidedef.getMiddle()));
			}
		}

		private getTexture(name: string): Wad.Graphic {
			// console.info(name);
			for (var t = 0; t < this.textures.length; t++) {
				let textures: Wad.Texture[] = this.textures[t].getTextures();
				for (var t2 = 0; t2 < textures.length; t2++) {


					if (textures[t2].getName() == name) {
						return textures[t2].getPatches()[0].pname.getGraphics();
					}
				}
			}

			return null;
		}

		getFloorTexture(): string {
			if (this.lowerSector)
				return this.lowerSector.getFloorTexture()
			return this.middleSector.getFloorTexture();
		}

		getCeilingTexture() : string {
			if (this.upperSector)
				return this.upperSector.getCeilingTexture();
			return this.middleSector.getCeilingTexture();
		}

		getUpperVertexes(): THREE.Vector3[] {
			if (this.upperSector)
				return this.upperSector.getVertexes();
			return [];
		}

		getLowerSector(): WallSector {
			if (this.lowerSector)
				return this.lowerSector;
			return null;
		}

		getMiddleSector(): WallSector {
			if (this.middleSector)
				return this.middleSector;
			return null;
		}
	}
}