module Engine {
	export class Floor extends THREE.Group {
		private mesh : THREE.Mesh;
		private material : THREE.MeshBasicMaterial;

		constructor(segs : Wad.Seg[]){
			super();

			this.material = new THREE.MeshBasicMaterial({
				transparent: true,
				// map: this.texture,
				color: 0x00FF00
			});

			this.material.side = THREE.DoubleSide;

			this.material.needsUpdate = true;

			const geom = new THREE.Geometry();

			for (var i = 0; i < segs.length; i++){
				const firstVertex : Wad.Vertex = segs[i].getStartVertex();
				const secondVertex : Wad.Vertex = segs[i].getEndVertex();
				
				vertice(firstVertex, secondVertex, segs[i].getLinedef().getRightSidedef());
				vertice(firstVertex, secondVertex, segs[i].getLinedef().getLeftSidedef());
				
				// geom.faces.push(new THREE.Face3(0, 2, 3));
			}

			if (geom.vertices.length < 3){
				geom.vertices.push(new THREE.Vector3(geom.vertices[0].x, geom.vertices[0].y, geom.vertices[1].z));
			}

			face();

			function vertice(firstVertex: Wad.Vertex, secondVertex: Wad.Vertex, sidedef : Wad.Sidedef){
				if (sidedef == null){
					return;
				}

				const floor = sidedef.getSector().getFloorHeight();

				geom.vertices.push(new THREE.Vector3(firstVertex.x / 10, floor / 10, firstVertex.y / 10));
				// geom.vertices.push(new THREE.Vector3(firstVertex.x / 10, floor / 10, secondVertex.y / 10));
				geom.vertices.push(new THREE.Vector3(secondVertex.x / 10, floor / 10, secondVertex.y / 10));
				// geom.vertices.push(new THREE.Vector3(secondVertex.x / 10, floor / 10, firstVertex.y / 10));
				// 
				
				
				
			}

			function face(){
				for (var i = 0; i < geom.vertices.length; i++){
					if (i > 1)
						geom.faces.push(new THREE.Face3(0, i - 1, i));
				}
				
			}

			
			// geom.vertices.push(new THREE.Vector3(this.firstVertex.x / 10, floor / 10, this.firstVertex.y / 10));
			// geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 10, floor / 10, this.secondVertex.y / 10));
			// geom.vertices.push(new THREE.Vector3(this.secondVertex.x / 10, floor / 10, this.secondVertex.y / 10));

			

			geom.computeFaceNormals();
			geom.computeVertexNormals();

			this.mesh = new THREE.Mesh(geom, this.material);

			this.add(this.mesh);
		}
	}
}