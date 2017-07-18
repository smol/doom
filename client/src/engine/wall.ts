/// <reference path="../../../node_modules/@types/three/index.d.ts" />

module Engine {
	export class Wall extends THREE.Group {
		private box: THREE.Mesh;
		private texture: THREE.DataTexture;
		private material: THREE.MeshBasicMaterial;

		constructor() {
			super();


		}

		setTexture(texture: Wad.Graphic) {
			console.info(texture.getName());

			const pixelData = [];
			// var w = texture.getWidth();
			// var h = texture.getHeight();

			const w = 64;
			const h = 64;

			for (let y = 0; y < h; ++y) {
				for (let x = 0; x < w; ++x) {
					const a = y < (h / 2) ? 50 : 255;
					const r = x < (w / 2) ? 255 : 100;
					pixelData.push(r, 0, 0, a);
				}
			}

			this.texture = new THREE.DataTexture(Uint8Array.from(pixelData), w, h, THREE.RGBAFormat, THREE.UnsignedByteType);

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				map: this.texture,
				color: 0xFF0000
			});

			this.material.needsUpdate = true;

			const assignUVs = geometry => {
				geometry.computeBoundingBox();

				const max = geometry.boundingBox.max;
				const min = geometry.boundingBox.min;

				const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
				const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

				geometry.faceVertexUvs[0] = [];
				const faces = geometry.faces;

				for (let i = 0; i < geometry.faces.length; i++) {
					const v1 = geometry.vertices[faces[i].a];
					const v2 = geometry.vertices[faces[i].b];
					const v3 = geometry.vertices[faces[i].c];

					geometry.faceVertexUvs[0].push([
						new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
						new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
						new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
					]);
				}
				geometry.uvsNeedUpdate = true;
			}


			// this.box.material = this.material;

			// this.material = new THREE.MeshBasicMaterial({
			// 	transparent: false,
			// 	map: this.material
			// 	// color: 0xFFFF00
			// });

			// create a box and add it to the scene
			const geom = new THREE.BoxGeometry(2, 2, 2);
			assignUVs(geom);
			this.box = new THREE.Mesh(geom, this.material);

			this.add(this.box);

			this.box.position.x = 2;
			this.box.position.z = 2;
		}
	}
}