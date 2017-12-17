// [8-3]: ENDOOM
// =============

//   When you finally have to leave DOOM, you exit to dos, and a colorful
// box of text appears. This is it. It is 4000 bytes, which are simply
// stored in the screen memory area for 80x25 16-color text mode. Thus
// it follows the same format as screen memory does: each character on
// the screen takes up two bytes. The first byte of each pair is from
// the (extended) ASCII character set, while the second byte of each pair
// is the color attribute for that character. The color attribute can
// be explained thus:

//  bit 7    6   5   4   3   2   1   0
//   +-----+---+---+---+---+---+---+---+
//   |     |   .   .   |   .   .   .   |
//   |Blink| Background|  Foreground   |
//   |     |   .   .   |   .   .   .   |
//   +-----+---+---+---+---+---+---+---+

//   So the foreground color can be from 0-15, the background color can
// be from 0-7, and the "blink" attribute is either on or off. All this
// very low-level info can be found in many ancient PC programming books,
// but otherwise it might be hard to locate...

var DOS: { r: number; g: number; b: number }[] = [
  { r: 0, g: 0, b: 0 }, // black
  { r: 0, g: 0, b: 128 }, // blue
  { r: 0, g: 128, b: 0 }, // green
  { r: 0, g: 128, b: 128 }, // aqua
  { r: 128, g: 0, b: 0 }, // red
  { r: 128, g: 0, b: 128 }, // purple
  { r: 128, g: 128, b: 0 }, // yellow
  { r: 192, g: 192, b: 192 }, // white
  { r: 128, g: 128, b: 128 }, // grey
  { r: 0, g: 0, b: 255 }, // light blue
  { r: 0, g: 255, b: 0 }, // light green
  { r: 0, g: 255, b: 255 }, // light aqua
  { r: 255, g: 0, b: 0 }, // light red
  { r: 255, g: 0, b: 255 }, // light purple
  { r: 255, g: 255, b: 0 }, // light yellow
  { r: 255, g: 255, b: 255 } // light white
];

import { Lump } from './lump';

export class Endoom extends Lump {
  private text: number[];
  private buffer: Uint8Array;
  private ascii: Uint8ClampedArray;
  private dosImage: HTMLImageElement;

  constructor(lump: any, data: any) {
    super(lump, data);
    var self = this;

    this.text = [];
    this.buffer = new Uint8Array(640 * 400 * 4);

    this.dosImage = new Image();
    this.dosImage.src = '/client/assets/dos.png';
    this.dosImage.onload = function() {
      self.loadAscii(this as HTMLImageElement);

      for (var i = 0; i < 2000; i++) {
        var char: number = self.dataView.getUint8(i * 2);
        var color: number = self.dataView.getUint8(i * 2 + 1);
        // var b : number = self.dataView.getUint8(i + 2);

        self.text.push(char);

        var fb = self.getColor(color);

        self.buffer = self.drawPixel(i, self.buffer, fb);
      }
    };
  }

  private loadAscii(image: HTMLImageElement) {
    var canvas = document.createElement('canvas');
    canvas.className = 'debug-container endoom';
    canvas.width = 256;
    canvas.height = 128;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    var imageData: ImageData = ctx.getImageData(0, 0, 256, 128);
    this.ascii = imageData.data;
  }

  getData(): Uint8Array {
    return this.buffer;
  }

  private getColor(
    color: number
  ): {
    f: { r: number; b: number; g: number };
    b: { r: number; b: number; g: number };
  } {
    var foreground = color & parseInt('00001111', 2);
    var background = color >> 4;
    var blink = false;
    if (background >= 8) {
      blink = true;
      background -= 8;
    }

    return { f: DOS[foreground], b: blink ? DOS[0] : DOS[background] };
  }

  private getAscii(code: number): Uint8ClampedArray {
    var buffer: Uint8ClampedArray = new Uint8ClampedArray(8 * 16 * 4);

    var startX: number = Math.round(code % 32) * 8;
    var startY: number = Math.floor(code / 32) * 16;

    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 16; y++) {
        var pox: number = startX + x;
        var poy: number = startY + y;

        buffer[(x + y * 8) * 4 + 0] = this.ascii[(pox + poy * 256) * 4 + 0];
        buffer[(x + y * 8) * 4 + 1] = this.ascii[(pox + poy * 256) * 4 + 1];
        buffer[(x + y * 8) * 4 + 2] = this.ascii[(pox + poy * 256) * 4 + 2];
        buffer[(x + y * 8) * 4 + 3] = this.ascii[(pox + poy * 256) * 4 + 3];
      }
    }

    return buffer;
  }

  private drawPixel(
    index: number,
    buffer: Uint8Array,
    colors: any
  ): Uint8Array {
    var startX: number = Math.round(index % 80) * 8;
    var startY: number = Math.floor(index / 80) * 16;

    var code: number = this.text[index];

    var asciiBuffer: Uint8ClampedArray = this.getAscii(code);

    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 16; y++) {
        var pox: number = startX + x;
        var poy: number = startY + y;

        var pos: number = 4 * (poy * 640 + pox);
        var ascii: number = (x + y * 8) * 4;

        buffer[pos + 0] = asciiBuffer[ascii + 0] ? colors.f.r : colors.b.r;
        buffer[pos + 1] = asciiBuffer[ascii + 1] ? colors.f.g : colors.b.g;
        buffer[pos + 2] = asciiBuffer[ascii + 2] ? colors.f.b : colors.b.b;
        buffer[pos + 3] = asciiBuffer[ascii + 3] ? 255 : 255;
      }
    }

    return buffer;
  }
}
