// [8-1]: PLAYPAL
// ==============

//   There are 14 palettes here, each is 768 bytes = 256 rgb triples.
// That is, the first three bytes of a palette are the red, green, and
// blue portions of color 0. And so on. Note that the values use the
// full range (0..255), while standard VGA digital-analog converters
// use values 0-63.
//   The first palette, palette 0, is used for most situations.
//   Palettes 10-12 are used (briefly) when an item is picked up, the
// more items that are picked up in quick succession, the brighter it
// gets, palette 12 being the brightest.
//   Palette 13 is used while wearing a radiation suit.
//   Palettes 3, 2, then 0 again are used after getting berserk strength.
//   If the player is hurt, then the palette shifts up to number X, then
// comes "down" one every second or so, to palette 2, then palette 0
// (normal) again. What X is depends on how badly the player got hurt:
// Over 100% damage (add health loss and armor loss), X=8. 93%, X=7. 81%,
// X=6. 55%, X=5. 35%, X=4. 16%, X=2. These are just rough estimates
// based on a single test session long ago. Why bother tracking down
// the exact division points?

//   Unknown: what palettes 1 and 9 are for.

import { Lump, LumpData} from './lump';

export class Playpal extends Lump {
  private colors: { r: number; g: number; b: number }[][];

  constructor(lump: LumpData, data: any) {
    super(lump, data);

    this.colors = [];

    for (var n = 0; n < 14; n++) {
      var temp: any[] = [];

      for (var i = 0; i < 256; i++) {
        var r: number = this.dataView.getUint8(n * 768 + i * 3 + 0);
        var g: number = this.dataView.getUint8(n * 768 + i * 3 + 1);
        var b: number = this.dataView.getUint8(n * 768 + i * 3 + 2);

        temp.push({ r: r, g: g, b: b });
      }

      this.colors.push(temp);
    }
  }

  getColors(): any[][] {
    return this.colors;
  }
}
