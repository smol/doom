module Engine {
	var NumVertices = 24;

	var vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
	];

	var colors = [
		[1.0, 1.0, 1.0, 1.0],    // Front face: white
		[1.0, 0.0, 0.0, 1.0],    // Back face: red
		[0.0, 1.0, 0.0, 1.0],    // Top face: green
		[0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
		[1.0, 1.0, 0.0, 1.0],    // Right face: yellow
		[1.0, 0.0, 1.0, 1.0]     // Left face: purple
	];



	export class Cube extends GameObject {
		private cubeVerticesColorBuffer: WebGLBuffer;
		private cubeVerticesIndexBuffer: WebGLBuffer;

		constructor() {
			super();
		}

		addGl(gl: WebGLRenderingContext) {
			super.addGl(gl);

			var generatedColors = [];

			for (var j = 0; j < 6; j++) {
				var c = colors[j];

				for (var i = 0; i < 4; i++) {
					generatedColors = generatedColors.concat(c);
				}
			}

			this.cubeVerticesColorBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(generatedColors), this.gl.STATIC_DRAW);

			this.cubeVerticesIndexBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

			// This array defines each face as two triangles, using the
			// indices into the vertex array to specify each triangle's
			// position.

			var cubeVertexIndices = [
				0, 1, 2, 0, 2, 3,    // front
				4, 5, 6, 4, 6, 7,    // back
				8, 9, 10, 8, 10, 11,   // top
				12, 13, 14, 12, 14, 15,   // bottom
				16, 17, 18, 16, 18, 19,   // right
				20, 21, 22, 20, 22, 23    // left
			]

			// Now send the element array to GL

			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
				new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
		}

		draw() {
			super.draw();

			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
			// setMatrixUniforms();
			this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
		}
	}
}
