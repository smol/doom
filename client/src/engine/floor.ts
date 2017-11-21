/// <reference path="./delaunay/delaunay.ts" />
/// <reference path="./delaunay/wtf.ts" />



module Engine {
	export class Floor extends THREE.Group {
		private mesh: THREE.Mesh;
		private material: THREE.MeshBasicMaterial;
		private geometry: THREE.Geometry;
		private texture: THREE.DataTexture;
		private textures: Wad.Flat[];
		private delaunay: Delaunay;
		private y: number = Number.MIN_VALUE;
		seg: Wad.Seg;

		private vertices: {start: THREE.Vector3, end: THREE.Vector3}[];
		private indices: number[];

		constructor(textures: Wad.Flat[], invert: Boolean = false) {
			super();

			this.textures = textures;
			this.vertices = [];
			this.delaunay = new Delaunay();

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0xFFFFFF
			});

			if (invert)
				this.material.side = THREE.DoubleSide;
			else
				this.material.side = THREE.DoubleSide;

			this.material.needsUpdate = true;
			this.geometry = new THREE.Geometry();

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.add(this.mesh);
		}

		private createFaces() {
			this.geometry.computeBoundingBox();
			
			var max = this.geometry.boundingBox.max,
				min = this.geometry.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.z);
			var range = new THREE.Vector2(max.x - min.x, max.z - min.z);
			var faces = this.geometry.faces;

			this.geometry.faceVertexUvs[0] = [];

			for (var i = 0; i < faces.length; i++) {

				var v1 = this.geometry.vertices[faces[i].a],
					v2 = this.geometry.vertices[faces[i].b],
					v3 = this.geometry.vertices[faces[i].c];

				this.geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.y) / range.y),
					new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.y) / range.y),
					new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.y) / range.y)
				]);
			}
			this.geometry.uvsNeedUpdate = true;
		}
	

		select(){
			console.info(JSON.stringify(this.vertices));
			this.children.forEach(child => {
				let mesh = child as THREE.Mesh;
				if (mesh.geometry.type === 'BoxGeometry'){
					
					(mesh.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
				}
			});
		}

		private repeatedTexture(size: { width: number, height: number }) {
			let bounding = this.geometry.boundingBox;
			if (!bounding)
				return;

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

			// console.info('width', width, 'height', height, 'size', size, 'result', result);
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

		addWall(linedef : Wad.Linedef, height: number, texture: string) {
			this.y = height;
			this.vertices.push({
				start: new THREE.Vector3(linedef.getFirstVertex().x, height, linedef.getFirstVertex().y),
				end: new THREE.Vector3(linedef.getSecondVertex().x,height, linedef.getSecondVertex().y)
			});

			this.setTexture(texture);
		}

		create() {
			this.geometry.vertices = [];
			

			var materialCube : THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ 
				color: 0x00ff00 
			});

			const segments : Segment[] = this.vertices.map(segment => {
				return new Segment(new Vector3(segment.start), new Vector3(segment.end));
			});
		
			var wtf = new Wtf(segments);
			const msegments = wtf.getPoints();
			console.info(msegments);
		
			// var delaunay = new Delaunay();
		
			// msegments.forEach(segments => {
				// delaunay.addSegments(segments);
			// });
		
			// console.info(msegments);
			// if (msegments.length > 1)
			// 	delaunay.addHoles(msegments[1]);
		
			// const triangles = delaunay.start();
			// const vertices = delaunay.vertices;

			// console.info(JSON.stringify(this.vertices));

			// vertices.forEach((vertex, i) => {
			// 	this.geometry.vertices.push(new THREE.Vector3(vertex.x, this.y, vertex.y));
			// });
			// console.info(vertices,triangles);
		
			// for (var i = 0; i < triangles.length; i += 3) {
			// 	this.geometry.faces.push(new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2]));
			// }
		
			// 

			var shape = new THREE.Shape();

			this.vertices.forEach((vertex, i)=>{
				if (i == 0)
					shape.moveTo(this.vertices[i].start.x, this.vertices[i].start.z);
				else {
					shape.lineTo(this.vertices[i].start.x, this.vertices[i].start.z);
				}

				shape.lineTo(this.vertices[i].end.x, this.vertices[i].end.z);
			});

			var shapePoint = shape.extractPoints(2);
			// THREE.ShapeUtils.tri

			this.geometry = new THREE.ShapeGeometry(shape);
			
			this.geometry.computeBoundingBox();
		
			var max = this.geometry.boundingBox.max,
				min = this.geometry.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.z);
			var range = new THREE.Vector2(max.x - min.x, max.z - min.z);
		
			range.x *= 0.01;
			range.y *= 0.01;
		
			this.geometry.faceVertexUvs[0] = [];
		
			for (var i = 0; i < this.geometry.faces.length; i++) {
		
				var v1 = this.geometry.vertices[this.geometry.faces[i].a],
					v2 = this.geometry.vertices[this.geometry.faces[i].b],
					v3 = this.geometry.vertices[this.geometry.faces[i].c];
		
				this.geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.y) / range.y),
					new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.y) / range.y),
					new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.y) / range.y)
				]);
			}
			this.geometry.uvsNeedUpdate = true;
		
			this.geometry.computeVertexNormals();
			this.geometry.computeFaceNormals();
			this.geometry.computeVertexNormals();
		}
	}
}