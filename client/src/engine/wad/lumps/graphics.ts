import Lump from './Lump';
import Playpal from './Playpal';

export default class Graphics extends Lump {
	private playpal: Playpal;

	private width: number;
	private height: number;
	private xOffset: number;
	private yOffset: number;

	private buffer: Uint8ClampedArray;

	constructor(playpal: Playpal, lump: any, data: any) {
		super(lump, data);

		this.playpal = playpal;

		this.width = this.dataView.getUint16(0, true);
		this.height = this.dataView.getUint16(2, true);
		this.xOffset = this.dataView.getUint16(4, true);
		this.yOffset = this.dataView.getUint16(6, true);

		// console.warn(lump.name);

		var columns: number[] = [];
		for (var i = 0; i < this.width; i++) {
			columns.push(this.dataView.getUint32(8 + (i * 4), true));
		}

		this.buffer = new Uint8ClampedArray(this.width * this.height);

		// if (lump.name === "END0"){
		// console.warn(lump.name, this.width, this.height, columns, this.dataView.byteLength);
		// }

		for (var i = 0; i < (this.width * this.height); i++) {
			this.buffer[i] = -1;
		}

		var position: number = 0;

		for (var i = 0; i < this.width; i++) {
			position = columns[i];
			var rowStart = 0;

			while (rowStart != 255) {
				rowStart = this.dataView.getUint8(position);
				position += 1;

				if (rowStart == 255) {
					break;
				}

				var pixelsNumber = this.dataView.getUint8(position);
				position += 1;

				var dummyValue = this.dataView.getUint8(position); // dummy value
				position++;

				for (var j = 0; j < pixelsNumber; j++) {
					this.buffer[((rowStart + j) * this.width) + i] = this.dataView.getUint8(position);
					position++;
				}

				this.dataView.getUint8(position); // dummy value
				position++;
			}

		}


		// var position = 0;
		// var pixelCount = 0;
		// var dummyValue = 0;

		// for (var i = 0; i < this.width; i++) {
		// 	for (var j = 0; j < this.height; j++) {
		// 		//-1 for transparency
		// 		this.buffer.push(-1);
		// 	}
		// }



		// for (var i = 0; i < this.width; i++) {

		// 	position = columns[i];
		// 	var rowStart = 0;

		// 	while (rowStart != 255) {

		// 		if (position >= this.dataView.byteLength) {
		// 			return;
		// 		}

		// 		rowStart = this.dataView.getUint8(position);
		// 		position += 1;

		// 		if (rowStart == 255) break;

		// 		if (position >= this.dataView.byteLength) {
		// 			return;
		// 		}

		// 		var pixelCount = this.dataView.getUint8(position);
		// 		position += 2;

		// 		for (var j = 0; j < pixelCount; j++) {
		// 			if (position >= this.dataView.byteLength) {
		// 				return;
		// 			}

		// 			this.buffer[((rowStart + j) * this.width) + i] = this.dataView.getUint8(position);
		// 			position += 1;
		// 		}
		// 		position += 1;
		// 	}
		// }


	}

	protected onclick() {
		super.onclick();

		var canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.height = this.height;
		canvas.width = this.width;
		canvas.className = 'debug-container endoom';

		var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
		var idata: ImageData = ctx.createImageData(canvas.width, canvas.height);

		var colors: Uint8ClampedArray = new Uint8ClampedArray(this.width * this.height * 4);

		for (var i = 0; i < this.buffer.length; i++) {
			if (this.buffer[i] !== -1) {
				var color = this.playpal.getColors()[0][this.buffer[i]];

				colors[i * 4 + 0] = color.r;
				colors[i * 4 + 1] = color.g;
				colors[i * 4 + 2] = color.b;
				colors[i * 4 + 3] = 255;
			} else {
				colors[i * 4 + 0] = 255;
				colors[i * 4 + 1] = 0;
				colors[i * 4 + 2] = 0;
				colors[i * 4 + 3] = 0;
			}

		}

		console.warn(colors);

		idata.data.set(colors);

		ctx.putImageData(idata, 0, 0);

		this.debugContainer.appendChild(canvas);
	}
}