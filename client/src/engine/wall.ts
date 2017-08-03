/// <reference path="../../../node_modules/@types/three/index.d.ts" />

module Engine {
	export class Wall extends THREE.Group {
		private mesh: THREE.Mesh;
		private texture: THREE.DataTexture;
		private material: THREE.MeshBasicMaterial;

		private firstVertex: Wad.Vertex;
		private secondVertex: Wad.Vertex;

		constructor(firstVertex: Wad.Vertex, secondVertex: Wad.Vertex) {
			super();

			this.firstVertex = firstVertex;
			this.secondVertex = secondVertex;
		}

		setTexture(texture: Wad.Graphic) {
			// console.info(texture.getName(), texture.getWidth(), texture.getHeight());

			const pixelData = [];
			// var width = texture.getWidth();
			// var height = texture.getHeight();

			// this.texture = new THREE.DataTexture(texture.getImageData(), width, height,
			// 	THREE.RGBAFormat,
			// 	THREE.UnsignedByteType,
			// 	THREE.UVMapping
			// );
			// this.texture.needsUpdate = true;

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0xFF0000
			});

			this.material.side = THREE.DoubleSide;

			this.material.needsUpdate = true;

			const geom = new THREE.Geometry();

			var v1 = new THREE.Vector3(0, 0, 0);
			var v2 = new THREE.Vector3(0, 500, 0);
			var v3 = new THREE.Vector3(0, 500, 500);

			// geom.vertices.push(
			// 	new THREE.Vector3(0, 0, 0),
			// 	new THREE.Vector3(0, -500, 0),
			// 	new THREE.Vector3(0, -500, 500),
			// 	new THREE.Vector3(0, 0, 500),
			// );

			geom.vertices.push(new THREE.Vector3(this.firstVertex.x / 20, 0, this.firstVertex.y / 20));
			geom.vertices.push(new THREE.Vector3(this.firstVertex.x / 20, 10, this.firstVertex.y / 20));
			geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 20, 10, this.secondVertex.y / 20));
			geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 20, 0, this.secondVertex.y / 20));

			geom.faces.push(new THREE.Face3(0, 1, 2));
			geom.faces.push(new THREE.Face3(0, 2, 3));
			
			geom.computeFaceNormals();
			geom.computeVertexNormals();

			this.mesh = new THREE.Mesh(geom, this.material);

			this.add(this.mesh);
		}
	}
}