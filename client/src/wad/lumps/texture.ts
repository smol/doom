// import Lump from './Lump';
/// <reference path="lump.ts" />


// [8-4]: TEXTURE1 and TEXTURE2
// ============================

//   These are lists of wall texture names used in SIDEDEFS lumps. Each
// wall texture is composed of one or more wall patches, whose names are
// listed in the PNAMES lump. But in a texture, the wall patches are not
// referred to by name, rather by the index number indicating what position
// they occupy in the PNAMES lump.
//   The TEXTURE2 lump is only present in the registered DOOM.WAD. The
// TEXTURE1 lump is identical in DOOM.WAD and the shareware DOOM1.WAD, and
// it only refers to pname numbers up to 163, because the shareware wad
// only has the first 163 wall patches, not all 350.

//   A TEXTURE lump starts with a 4-byte long integer N which is the number
// of textures defined in it. Following it are N long integers which are the
// offsets in bytes from the beginning of the TEXTURE lump to the start of
// each texture's definition.
//   Then there are N texture definitions, which have the following format.
// The first (texture name) field is an 8-byte string (less than 8 byte
// names are padded with zeros), the rest of the fields are 2-byte short
// integers:

// (1) The name of the texture, used in SIDEDEFS, e.g. "FIREWALL".
// (2) always 0.
// (3) always 0.
// (4) total width of texture
// (5) total height of texture

// 	The fourth and fifth fields define a "space" (usually 128 by 128
//       or 64 by 72 or etc...) in which individual wall patches are placed
//       to form the overall picture. To tile vertically on a very tall wall
//       without exhibiting the "Tutti Frutti" effect, a texture must have
//       height 128, the maximum. There is no maximum width.

// (6) always 0.
// (7) always 0.
// (8) Number of 5-field (5 <short>) patch descriptors that follow. This
// means that each texture entry has variable length. Many entries have just
// 1 patch, the most used in DOOM in a single texture is 64.

//   Patch descriptor:

//   (a) x offset from top-left corner of texture space defined in fields
// 	4 and 5 to start placement of this patch
//   (b) y offset
//   (c) number (0...) of the entry in the PNAMES lump that contains the
// 	lump name from the directory, of the wall patch to use...
//   (d) always 1, is for something called "stepdir"...
//   (e) always 0, is for "colormap"...

//   Each texture's entry ends after the last of its patch descriptors.
//   Note that patches can have transparent parts, since they are in the
// same picture format as everything else. Thus there can be (and are)
// transparent wall textures. These should only be used on a border between
// two sectors, to avoid "hall of mirrors" problems.
//   Also, textures intended for use as the "middle" texture of a 2-sided
// SIDEDEF (e.g. transparent textures) should only be composed of a single
// patch. A limitation in the game engine will cause the "medusa" effect
// if there is more than 1 patch in any middle texture that is visible in
// the display window. This effect causes the computer to slow to a crawl
// and make play impossible until the offending wall is out of view.


// [8-4-1]: Animated Walls
// -----------------------

//   Some of the walls and floors are animated. In the case of wall
// textures, it is possible to substantially customize these animations.
// Flats' animations can theoretically also be modified, but since flats
// don't work from pwads, that can make the effort very difficult.
//   The game engine sets up a number of wall animation cycles based on
// what entries it finds in the TEXTURE lumps. It also sets up flat
// animations based on what lumps exist between F_START and F_END.
// Versions before 1.666 can have up to 9 animated walls and 5 animated
// flats. Version 1.666 (DOOM 1 or 2) can have 13 walls and 9 floors
// animate.
//   For wall animations, the entries in the columns "First" and "Last"
// below, and all the entries between them (in the order that they occur
// in the TEXTURE lump) are linked. If one of them is listed as a texture
// on a sidedef, that sidedef will change texture to the next in the cycle
// about 3 times a second, going back to <First> after <Last>. Flats work
// similarly, except the order is dictated by the wad directory. If both
// of the <First> and <Last> texture/flat names are not present, no problem.
// Then that potential cycle is unused. But if <First> is present, and
// <Last> either is not present or is listed BEFORE <First>, then an
// error occurs while the DOOM operating system sets up, and it aborts.
//   Note that much longer sequences are possible! The entries between
// <First> and <Last> can be almost anything; they need not be the same
// in number as in the original, nor do they have to follow the same
// naming pattern. Thus one could set up SLADRIP1, TRON2, TRON3, TRON4,
// ..., TRON67, SLADRIP3 for a 69-frame animated wall!
//   The "Ver" column indicates what version of DOOM is required. "All"
// indicates all versions have it. The "r" signifies that the shareware
// DOOM1.WAD does not contain the necessary picture lumps. The "2" means
// that only DOOM 2 has the necessary picture lumps, but version 1.666 of
// DOOM.EXE for DOOM 1 also has the capability to use these animation-cycle
// names (for pwad designers).

// First       Last         Ver    Normal # of frames

// BLODGR1     BLODGR4       r     4
// BLODRIP1    BLODRIP4      r     4
// FIREBLU1    FIREBLU2      r     2
// FIRELAV3    FIRELAVA      r     2 (3 patches are in DOOM.WAD, 1 is unused)
// FIREMAG1    FIREMAG3      r     3
// FIREWALA    FIREWALL      r     3
// GSTFONT1    GSTFONT3      r     3
// ROCKRED1    ROCKRED3      r     3
// SLADRIP1    SLADRIP3     All    3

// BFALL1      BFALL4        2     4
// SFALL1      SFALL4        2     4
// WFALL1      WFALL4        2     4
// DBRAIN1     DBRAIN4       2     4

// (floor/ceiling animations):

// NUKAGE1     NUKAGE3      All    3
// FWATER1     FWATER4       r     4
// SWATER1     SWATER4       -     4 (SWATER lumps aren't in any DOOM.WAD)
// LAVA1       LAVA4         r     4
// BLOOD1      BLOOD3        r     3

// RROCK05     RROCK08       2     4
// SLIME01     SLIME04       2     4
// SLIME05     SLIME08       2     4
// SLIME09     SLIME12       2     4


// [8-4-2]: The SKY Textures
// -------------------------

//   The SKY1, SKY2, and SKY3 textures are rather special in that they are
// used as sky backgrounds when the player is out in the open. They can
// also be used on regular walls, but they usually aren't, because then
// they just look like a painting. The "background" effect is done by
// the game engine. There is a special flat, F_SKY1, which is used to
// indicate that a floor or ceiling is "transparent" to the SKY beyond.
// The picture data in the F_SKY1 flat is not even used.
//   Upper textures between F_SKY1 ceilinged sectors do not have the
// specified texture (if any) drawn. Instead, they are "sky". Likewise
// with lower textures between F_SKY1 floored sectors, but it doesn't
// work as well, because if the player's viewpoint is below the top of
// a lower-texture-sky (i.e. if any part of it is in the upper half of
// the display), it causes a hall-of-mirrors effect.
//   SKY textures as sky backgrounds are mirror-images of what they look
// like on walls.
//   The SKY textures are always placed with their tops at the top of the
// view window. Since they cannot be more than 128 high, just like any
// other texture, a rather ugly "seam" in the sky is sometimes visible
// if the player can see too far "down".
//   SKY textures do move horizontally, though, to give a realistic
// effect. Doing a complete 360 degree turn will scroll by a 256-wide
// SKY four times. A 1024-wide SKY will exactly circumscribe the horizon.
// The 0 column of the SKY texture will be at due north (as on the automap),
// the 256 column is at west, 512 is south, and 768 is east. So the middle
// part of a 256-wide SKY is visible at NW, SW, SE, and NE.

//   SKY textures can be composed of several patches, just like regular
// textures, but trying to animate the sky doesn't work. DOOM.EXE can be
// changed so that SKY2 is the start of an animation cycle, and indeed
// on a wall it will animate, but the sky background does not. This is
// perhaps related to the way that "middle" textures of sidedefs do not
// animate.

module Wad {
	export class TexturePatch {
		x : number;
		y : number;
		pnameIndex : number;
		stepdir : number;
		colormap : number;
		pname : Pname;
	}

	export class Texture {
		private dataView: DataView;
		private name: string;
		private width: number;
		private height: number;
		private offset: number = 0;
		private patches : TexturePatch[];

		constructor(playpal: Playpal, data: any) {
			this.dataView = new DataView(data);

			this.name = "";

			for (; this.offset < 8; this.offset++) {
				this.name += String.fromCharCode(this.dataView.getUint8(this.offset));
			}

			this.offset += 2; // always zero
			this.offset += 2; // always zero

			this.width = this.dataView.getUint8(this.offset);
			this.offset += 2;

			this.height = this.dataView.getUint8(this.offset);
			this.offset += 2;

			this.offset += 2; // always zero
			this.offset += 2; // always zero

			var patchCount: number = this.dataView.getInt8(this.offset);
			this.offset += 2;
			this.patches = [];

			for (var i = 0; i < patchCount; i++) {
				var x = this.dataView.getUint8(this.offset);
				this.offset += 2;
				var y = this.dataView.getUint8(this.offset);
				this.offset += 2;

				var index: number = this.dataView.getUint8(this.offset);
				this.offset += 2;

				var stepdir: number = this.dataView.getUint8(this.offset);
				this.offset += 2;

				var colormap: number = this.dataView.getUint8(this.offset);
				this.offset += 2;

				this.patches.push({ x: x, y: y, pnameIndex: index, stepdir: stepdir, colormap: colormap, pname: null });
			}
		}

		getName() : string {
			return this.name;
		}

		getPatches() : TexturePatch[] {
			return this.patches;
		}

		getPnameIndex() : number {
			return 0;
			// return this.patches
		}

		getSize(): number {
			return this.offset;
		}
	}
}
