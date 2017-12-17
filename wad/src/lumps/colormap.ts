// import Lump from './Lump';
// import Playpal from './Playpal';

// [8-2]: COLORMAP
// ===============

//   This contains 34 sets of 256 bytes, which "map" the colors "down" in
// brightness. Brightness varies from sector to sector. At very low
// brightness, almost all the colors are mapped to black, the darkest gray,
// etc. At the highest brightness levels, most colors are mapped to their
// own values, i.e. they don't change.
//   In each set of 256 bytes, byte 0 will have the number of the palette
// color to which original color 0 gets mapped.
//   The colormaps are numbered 0-33. Colormaps 0-31 are for the different
// brightness levels, 0 being the brightest (light level 248-255), 31 being
// the darkest (light level 0-7). Light level is the fifth field of each
// SECTOR record, see [4-9].
//   Colormap 32 is used for every pixel in the display window (but not
// the status bar), regardless of sector brightness, when the player is
// under the effect of the "Invulnerability" power-up. This colormap is
// all whites and greys.
//   Colormap 33 is all black for some reason.
//   While the light-amplification goggles power-up is in effect, everything
// in the display uses colormap 0, regardless of sector brightness.

import { Lump } from './lump';
import { Playpal } from './playpal';

export class ColorMap extends Lump {
  private playpal: Playpal;
  private sets: { index: number; brightness: number[] }[];

  private colors: { r: number; g: number; b: number }[];

  constructor(playpal: Playpal, lump: any, data: any) {
    super(lump, data);

    this.playpal = playpal;
    this.sets = [];

    this.colors = [];

    var colors: any[] = this.playpal.getColors()[0];

    for (var i = 0; i < 34; i++) {
      var temp: number[] = [];
      // var index : number = this.dataView.getUint8(i * 256);

      // console.warn('index', index);

      for (var b = 0; b < 256; b++) {
        var byte: number = this.dataView.getUint8(i * 256 + b);

        temp.push(byte);
        this.colors.push(colors[byte]);
      }

      this.sets.push({ index: 0, brightness: temp });
    }
  }

  getColors() {
    return this.colors;
  }

  protected onclick() {
    // super.onclick();
    // var div: HTMLDivElement = document.createElement('div');
    // div.className = 'debug-container colormap';
    // this.debugContainer.appendChild(div);
    // for (var i = 0; i < 256; i++) {
    // 	for (var s = 0; s < 34; s++) {
    // 		var color =
    // 	}
    // 	div.appendChild(wrapper);
    // }
  }
}
