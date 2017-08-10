/// <reference path="../../../node_modules/@types/three/index.d.ts" />

module Engine {
	export class Wall extends THREE.Group {
		private mesh: THREE.Mesh;
		private texture: THREE.DataTexture;
		private material: THREE.MeshBasicMaterial;

		private firstVertex: Wad.Vertex;
		private secondVertex: Wad.Vertex;

		seg: Wad.Seg;

		constructor(seg: Wad.Seg) {
			super();

			this.seg = seg;
			this.firstVertex = seg.getStartVertex();
			this.secondVertex = seg.getEndVertex();

			let rightSidedef: Wad.Sidedef = seg.getLinedef().getRightSidedef();
			let rightSector: Wad.Sector = rightSidedef.getSector();

			let ceiling: number = rightSector.getCeilingHeight();
			let floor: number = rightSector.getFloorHeight();

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				// color: 0x002200
			});

			this.material.side = THREE.DoubleSide;

			this.material.needsUpdate = true;

			const geom = new THREE.Geometry();

			geom.vertices.push(new THREE.Vector3(this.firstVertex.x / 10, floor / 10, this.firstVertex.y / 10));
			geom.vertices.push(new THREE.Vector3(this.firstVertex.x / 10, ceiling / 10, this.firstVertex.y / 10));
			geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 10, ceiling / 10, this.secondVertex.y / 10));
			geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 10, floor / 10, this.secondVertex.y / 10));

			geom.faces.push(new THREE.Face3(0, 1, 2));
			geom.faces.push(new THREE.Face3(0, 2, 3));

			geom.computeBoundingBox();

			var max = geom.boundingBox.max,
				min = geom.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var faces = geom.faces;

			geom.faceVertexUvs[0] = [];

			for (var i = 0; i < faces.length; i++) {

				var v1 = geom.vertices[faces[i].a],
					v2 = geom.vertices[faces[i].b],
					v3 = geom.vertices[faces[i].c];

				geom.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
					new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
					new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
				]);
			}
			geom.uvsNeedUpdate = true;

			geom.computeFaceNormals();
			geom.computeVertexNormals();

			this.mesh = new THREE.Mesh(geom, this.material);

			this.add(this.mesh);
		}

		getMesh(): THREE.Mesh {
			return this.mesh;
		}

		setTexture(texture: Wad.Graphic) {
			if (texture == null) {
				return;
			}
			// console.info(texture.getName(), texture.getWidth(), texture.getHeight());

			const pixelData = [];
			var width = texture.getWidth();
			var height = texture.getHeight();

			var data: Uint8Array = Uint8Array.from(texture.getImageData());
			this.texture = new THREE.DataTexture(data, width, height,
				THREE.RGBAFormat,
				THREE.UnsignedByteType,
				THREE.UVMapping,
				THREE.ClampToEdgeWrapping,
				THREE.ClampToEdgeWrapping,
				THREE.LinearFilter,
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



			// geom.vertices.push(
			// 	new THREE.Vector3(0, 0, 0),
			// 	new THREE.Vector3(0, -500, 0),
			// 	new THREE.Vector3(0, -500, 500),
			// 	new THREE.Vector3(0, 0, 500),
			// );


		}
	}
}