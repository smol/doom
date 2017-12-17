import { Lump } from './lump';
import { Playpal } from './playpal';

export class Flat extends Lump {
  private buffer: Uint8ClampedArray;

  constructor(playpal: Playpal, lump: any, data: any) {
    super(lump, data);

    let width: number = 64;
    let height: number = 64;

    let colors: { r: number; g: number; b: number }[] = playpal.getColors()[0];
    this.buffer = new Uint8ClampedArray(width * height * 4);

    for (var i = 0; i < this.dataView.byteLength; i++) {
      let index: number = this.dataView.getUint8(i);

      this.buffer[i * 4 + 0] = colors[index].r;
      this.buffer[i * 4 + 1] = colors[index].g;
      this.buffer[i * 4 + 2] = colors[index].b;
      this.buffer[i * 4 + 3] = 255;
    }
  }

  getWidth(): number {
    return 64;
  }
  getHeight(): number {
    return 64;
  }
  getImageData(): Uint8ClampedArray {
    return this.buffer;
  }
}
