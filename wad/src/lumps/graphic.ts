import { Textures } from "./textures";
import { Lump } from "./lump";
import { Playpal } from "./playpal";
import { Pnames } from "./pnames";

export class Graphic extends Lump {
  private playpal: Playpal;

  private width: number;
  private height: number;
  private xOffset: number;
  private yOffset: number;

  private dummyValue: number[][];

  private buffer: Int16Array;
  private imageData: Uint8ClampedArray;

  constructor(playpal: Playpal, lump: any, data: any, pnames: Pnames) {
    super(lump, data);

    this.playpal = playpal;

    pnames.setGraphic(this);

    this.width = this.dataView.getUint16(0, true);
    this.height = this.dataView.getUint16(2, true);
    this.xOffset = this.dataView.getInt16(4, true);
    this.yOffset = this.dataView.getInt16(6, true);

    // console.warn(lump.name);

    var columns: number[] = [];
    for (var i = 0; i < this.width; i++) {
      columns.push(this.dataView.getUint32(8 + i * 4, true));
    }

    this.buffer = new Int16Array(this.width * this.height);
    this.imageData = new Uint8ClampedArray(this.width * this.height * 4);

    // if (lump.name === "END0"){
    // console.warn(lump.name, this.width, this.height, columns, this.dataView.byteLength);
    // }

    for (var i = 0; i < this.width * this.height; i++) {
      this.buffer[i] = -1;
    }

    let position: number = 0;

    for (var i = 0; i < this.width; i++) {
      position = columns[i];
      let rowStart = 0;

      while (rowStart != 255) {
        rowStart = this.dataView.getUint8(position);
        position += 1;

        if (rowStart == 255) {
          break;
        }

        const pixelsNumber = this.dataView.getUint8(position);
        position += 1;

        // var dummyValue = this.dataView.getUint8(position); // dummy value
        position++;

        for (var j = 0; j < pixelsNumber; j++) {
          this.buffer[(rowStart + j) * this.width + i] =
            this.dataView.getUint8(position);
          position++;
        }

        // this.dataView.getUint8(position); // dummy value
        position++;
      }
    }

    const newPlaypal = this.playpal.getColors()[0];
    for (var i = 0; i < this.buffer.length; i++) {
      if (this.buffer[i] != -1) {
        var color = newPlaypal[this.buffer[i]];

        this.imageData[i * 4 + 0] = color.r;
        this.imageData[i * 4 + 1] = color.g;
        this.imageData[i * 4 + 2] = color.b;
        this.imageData[i * 4 + 3] = 255;
      } else {
        this.imageData[i * 4 + 0] = 0;
        this.imageData[i * 4 + 1] = 0;
        this.imageData[i * 4 + 2] = 0;
        this.imageData[i * 4 + 3] = 0;
      }
    }
  }

  getDummy() {
    return this.dummyValue;
  }

  getOffset(): { x: number; y: number } {
    return { x: this.xOffset, y: this.yOffset };
  }

  getImageData(): Uint8ClampedArray {
    return this.imageData;
  }

  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
}
