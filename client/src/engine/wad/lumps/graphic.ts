import Lump from './Lump';
import Playpal from './Playpal';

export default class Graphics extends Lump {
	private playpal: Playpal;

	private width: number;
	private height: number;
	private xOffset: number;
	private yOffset: number;

	private buffer: Uint8ClampedArray;
	private imageData : Uint8ClampedArray;

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
		this.imageData = new Uint8ClampedArray(this.width * this.height * 4);

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

		for (var i = 0; i < this.buffer.length; i++) {
			if (this.buffer[i] !== -1) {
				var color = this.playpal.getColors()[0][this.buffer[i]];

				this.imageData[i * 4 + 0] = color.r;
				this.imageData[i * 4 + 1] = color.g;
				this.imageData[i * 4 + 2] = color.b;
				this.imageData[i * 4 + 3] = 255;
			} else {
				this.imageData[i * 4 + 0] = 255;
				this.imageData[i * 4 + 1] = 0;
				this.imageData[i * 4 + 2] = 0;
				this.imageData[i * 4 + 3] = 0;
			}

		}
	}

	getImageData() : Uint8ClampedArray {
		return this.imageData;
	}

	getWidth() : number { return this.width; }
	getHeight() : number { return this.height; }
}