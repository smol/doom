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
			console.info(texture.getName(), texture.getWidth(), texture.getHeight());

			const pixelData = [];
			var width = texture.getWidth();
			var height = texture.getHeight();

			this.texture = new THREE.DataTexture(texture.getImageData(), width, height,
				THREE.RGBAFormat,
				THREE.UnsignedByteType,
				THREE.UVMapping
			);
			this.texture.needsUpdate = true;

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

			geom.vertices.push(
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 500, 0),
				new THREE.Vector3(0, 500, 500)
			);

			geom.faces.push(new THREE.Face3(0, 1, 2));
			
			// var object = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
			console.info(this.firstVertex, this.secondVertex);

			// var a = {
			// 	x: 100,
			// 	y: 500
			// }
			// var b = {
			// 	x: 100,
			// 	y: 500
			// }

			// console.info(a, b);

			// // var geometry = new THREE.Geometry();

			// geom.vertices.push(new THREE.Vector3(a.x, a.y, 2));
			// geom.vertices.push(new THREE.Vector3(b.x, a.y, 2));
			// geom.vertices.push(new THREE.Vector3(b.x, b.y, 2));
			// geom.vertices.push(new THREE.Vector3(a.x, b.y, 2));

			// // geom.vertices.push(new THREE.Vector3(this.firstVertex.x, 200, this.firstVertex.y));
			// // geom.vertices.push(new THREE.Vector3(this.secondVertex.x, 200, this.firstVertex.y));
			// // geom.vertices.push(new THREE.Vector3(this.secondVertex.x, 200, this.secondVertex.y));
			// // geom.vertices.push(new THREE.Vector3(this.firstVertex.x, 200, this.secondVertex.y));

			// geom.faces.push(new THREE.Face3(0, 1, 2));
			// geom.faces.push(new THREE.Face3(0, 2, 3));
			geom.computeFaceNormals();
			geom.computeVertexNormals();
			// console.info('test');

			this.mesh = new THREE.Mesh(geom, this.material);

			this.add(this.mesh);

			// this.position.x = 2;
			// this.position.z = 2;

			// const assignUVs = geometry => {
			// 	geometry.computeBoundingBox();

			// 	const max = geometry.boundingBox.max;
			// 	const min = geometry.boundingBox.min;

			// 	const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			// 	const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

			// 	geometry.faceVertexUvs[0] = [];
			// 	const faces = geometry.faces;

			// 	for (let i = 0; i < geometry.faces.length; i++) {
			// 		const v1 = geometry.vertices[faces[i].a];
			// 		const v2 = geometry.vertices[faces[i].b];
			// 		const v3 = geometry.vertices[faces[i].c];

			// 		geometry.faceVertexUvs[0].push([
			// 			new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
			// 			new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
			// 			new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
			// 		]);
			// 	}
			// 	geometry.uvsNeedUpdate = true;
			// }


			// this.box.material = this.material;

			// this.material = new THREE.MeshBasicMaterial({
			// 	transparent: false,
			// 	map: this.material
			// 	// color: 0xFFFF00
			// });

			// create a box and add it to the scene

		}
	}
}