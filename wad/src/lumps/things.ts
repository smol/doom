import { Vertex } from ".";
import { Lump } from "./lump";
import { Sector } from "./sectors";

var DoomThingTable = {
  3004: { label: "zombie", sprite: "POSS", sequence: "+" },
  9: { label: "sergeant", sprite: "SPOS", sequence: "+" },
  84: { label: "ss guy", sprite: "SSWV", sequence: "+" },
  65: { label: "commando", sprite: "CPOS", sequence: "+" },
  3001: { label: "imp", sprite: "TROO", sequence: "+" },
  3002: { label: "demon", sprite: "SARG", sequence: "+" },
  58: { label: "spectre", sprite: "SARG", sequence: "+" },
  3006: { label: "lost soul", sprite: "SKUL", sequence: "+" },
  3005: { label: "cacodemon", sprite: "HEAD", sequence: "+" },
  69: { label: "hell knight", sprite: "BOS2", sequence: "+" },
  3003: { label: "baron of hell", sprite: "BOSS", sequence: "+" },
  68: { label: "arachnotron", sprite: "BSPI", sequence: "+" },
  71: { label: "pain elemental", sprite: "PAIN", sequence: "+" },
  66: { label: "revenant", sprite: "SKEL", sequence: "+" },
  67: { label: "mancubus", sprite: "FATT", sequence: "+" },
  64: { label: "archvile", sprite: "VILE", sequence: "+" },
  16: { label: "cyberdemon", sprite: "CYBR", sequence: "+" },
  7: { label: "spider mastermind", sprite: "SPID", sequence: "+" },
  88: { label: "romero head", sprite: "BBRN", sequence: "+" },

  87: { label: "spawn target", sprite: "", sequence: "-" },
  89: { label: "spawn shooter", sprite: "", sequence: "-" },
  72: { label: "commander keen", sprite: "", sequence: "-" },

  2001: { label: "shotgun", sprite: "SHOT", sequence: "a" },
  82: { label: "super shotgun", sprite: "SGN2", sequence: "a" },
  2002: { label: "chaingun", sprite: "MGUN", sequence: "a" },
  2003: { label: "rocket launcher", sprite: "LAUN", sequence: "a" },
  2004: { label: "plasma gun", sprite: "PLAS", sequence: "a" },
  2005: { label: "chainsaw", sprite: "CSAW", sequence: "a" },
  2006: { label: "bfg 9000", sprite: "BFUG", sequence: "a" },
  2007: { label: "ammo clip", sprite: "CLIP", sequence: "a" },
  2048: { label: "ammo box", sprite: "AMMO", sequence: "a" },
  2008: { label: "shells", sprite: "SHEL", sequence: "a" },
  2049: { label: "shell box", sprite: "SBOX", sequence: "a" },
  2010: { label: "rocket", sprite: "ROCK", sequence: "a" },
  2046: { label: "rocket box", sprite: "BROK", sequence: "a" },
  2047: { label: "cell charge", sprite: "CELL", sequence: "a" },
  17: { label: "cell pack", sprite: "CELP", sequence: "a" },
  8: { label: "backpack", sprite: "BPAK", sequence: "a" },

  2011: { label: "stimpack", sprite: "STIM", sequence: "a" },
  2012: { label: "medikit", sprite: "MEDI", sequence: "a" },
  2013: { label: "supercharge", sprite: "SOUL", sequence: "abcdcb" },
  2014: { label: "health bonus", sprite: "BON1", sequence: "abcdcb" },
  2015: { label: "armor bonus", sprite: "BON2", sequence: "abcdcb" },
  2018: { label: "green armor", sprite: "ARM1", sequence: "ab" },
  2019: { label: "blue armor", sprite: "ARM2", sequence: "ab" },
  2022: { label: "invulnerability", sprite: "PINV", sequence: "abcd" },
  2023: { label: "berserk", sprite: "PSTR", sequence: "a" },
  2024: { label: "invisibility", sprite: "PINS", sequence: "abcd" },
  2025: { label: "radiation suit", sprite: "SUIT", sequence: "a" },
  2026: { label: "computer map", sprite: "PMAP", sequence: "abcdcb" },
  2045: { label: "goggles", sprite: "PVIS", sequence: "ab" },
  83: { label: "megasphere", sprite: "MEGA", sequence: "abcd" },
  13: { label: "red keycard", sprite: "", sequence: "-" },
  6: { label: "yellow keycard", sprite: "", sequence: "-" },
  5: { label: "blue keycard", sprite: "", sequence: "-" },
  38: { label: "red skull key", sprite: "", sequence: "-" },
  39: { label: "yellow skull key", sprite: "", sequence: "-" },
  40: { label: "blue skull key", sprite: "", sequence: "-" },
  1: { label: "player 1 start", sprite: "", sequence: "-" },
  2: { label: "player 2 start", sprite: "", sequence: "-" },
  3: { label: "player 3 start", sprite: "", sequence: "-" },
  4: { label: "player 4 start", sprite: "", sequence: "-" },
  11: { label: "deathmatch start", sprite: "", sequence: "-" },
  14: { label: "teleport destination", sprite: "", sequence: "-" },
  10: { label: "gibs 1", sprite: "", sequence: "-" },
  12: { label: "gibs 2", sprite: "", sequence: "-" },
  15: { label: "dead marine", sprite: "", sequence: "-" },
  18: { label: "dead zombie", sprite: "", sequence: "-" },
  19: { label: "dead sergeant", sprite: "", sequence: "-" },
  20: { label: "dead imp", sprite: "", sequence: "-" },
  21: { label: "dead demon", sprite: "", sequence: "-" },
  22: { label: "dead cacodemon", sprite: "", sequence: "-" },
  23: { label: "dead lost soul", sprite: "", sequence: "-" },
  24: { label: "pool of blood", sprite: "", sequence: "-" },
  25: { label: "impaled human 1", sprite: "", sequence: "-" },
  26: { label: "impaled human 2", sprite: "", sequence: "-" },
  27: { label: "skull on pole", sprite: "", sequence: "-" },
  28: { label: "five skulls", sprite: "", sequence: "-" },
  29: { label: "skull pile", sprite: "", sequence: "-" },
  49: { label: "hangman 1", sprite: "", sequence: "-" },
  50: { label: "hangman 2", sprite: "", sequence: "-" },
  51: { label: "hangman 3", sprite: "", sequence: "-" },
  52: { label: "hangman 4", sprite: "", sequence: "-" },
  53: { label: "hangman 5", sprite: "", sequence: "-" },
  59: { label: "hangman 2 (passable)", sprite: "", sequence: "-" },
  60: { label: "hangman 4 (passable)", sprite: "", sequence: "-" },
  61: { label: "hangman 3 (passable)", sprite: "", sequence: "-" },
  62: { label: "hangman 5 (passable)", sprite: "", sequence: "-" },
  63: { label: "hangman 1 (passable)", sprite: "", sequence: "-" },
  30: { label: "green pillar", sprite: "", sequence: "-" },
  31: { label: "short green pillar", sprite: "", sequence: "-" },
  32: { label: "red pillar", sprite: "", sequence: "-" },
  33: { label: "short red pillar", sprite: "", sequence: "-" },
  34: { label: "candle", sprite: "", sequence: "-" },
  35: { label: "candelabra", sprite: "", sequence: "-" },
  36: { label: "green pillar with heart", sprite: "", sequence: "-" },
  37: { label: "red pillar with skull", sprite: "", sequence: "-" },
  41: { label: "eye", sprite: "", sequence: "-" },
  42: { label: "skull rock", sprite: "", sequence: "-" },
  43: { label: "gray tree", sprite: "", sequence: "-" },
  44: { label: "blue torch", sprite: "", sequence: "-" },
  45: { label: "green torch", sprite: "", sequence: "-" },
  46: { label: "red torch", sprite: "", sequence: "-" },
  47: { label: "scrub", sprite: "", sequence: "-" },
  48: { label: "tech column", sprite: "", sequence: "-" },
  54: { label: "brown tree", sprite: "", sequence: "-" },
  55: { label: "short blue torch", sprite: "", sequence: "-" },
  56: { label: "short green torch", sprite: "", sequence: "-" },
  57: { label: "short red torch", sprite: "", sequence: "-" },
  2028: { label: "floor lamp", sprite: "", sequence: "-" },
  2035: { label: "barrel", sprite: "", sequence: "-" },
};

// [4-2]: THINGS
// =============

//   "Things" in DOOM are player start positions, monsters, weapons, keys,
// barrels, etc. The size of each THINGS lump will be a multiple of ten,
// since each thing requires ten bytes to describe it, in five <short>
// fields:

// (1) X position of thing (at level's inception)
// (2) Y position of thing
// (3) Angle the thing faces. On the automap, 0 is east, 90 is north, 180
//       is west, 270 is south. This value is only used for monsters, player
//       starts, deathmatch starts, and teleporter landing spots. Other
//       things look the same from all directions. Values are rounded to
//       the nearest 45 degree angle, so if the value is 80, it will
//       actually face 90 - north.
// (4) Type of thing, see next subsection, [4-2-1]
// (5) Thing options, see [4-2-3]

export class Things extends Lump {
  private things: Thing[] = [];

  constructor(lump: any, data: any) {
    super(lump, data);

    for (var i = 0; i < this.dataView.byteLength; i += 10) {
      this.things.push(new Thing(i, this.dataView));
    }
  }

  getThingsFromSector(sector: Sector): Thing[] {
    const vertices = sector.vertices;

    return this.things.filter((thing) => {
      const { x, z } = thing.getPosition();

      interface Vertex {
        start: { x: number; y: number };
        end: { x: number; y: number };
      }

      const isLeftOrRight = ({ start, end }: Vertex) => {
        return (
          (end.y - start.y) * (x - start.x) - (z - start.y) * (end.x - start.x)
        );
      };

      let w = 0;
      for (let i = 0; i < vertices.length; i++) {
        const { start, end } = vertices[i];
        if (start.y <= z && end.y > z && isLeftOrRight(vertices[i]) > 0) {
          w++;
        } else if (
          start.y > z &&
          end.y <= z &&
          isLeftOrRight(vertices[i]) < 0
        ) {
          w--;
        }
      }

      return w != 0;
    });

    // return this.things.filter((thing) => {
    //   const { x, z } = thing.getPosition();

    //   const cross = (first: Vertex, second: Vertex) => {
    //     return (first.x - x) * (second.y - z) - (second.x - x) * (first.y - z);
    //   };

    //   let wn = 0; // winding number

    //   sidedefs.forEach((a, i) => {
    //     // const b = sidedefs[(i + 1) % sidedefs.length];
    //     if (a.getLinedef().getFirstVertex().y <= z) {
    //       if (
    //         a.getLinedef().getSecondVertex().y > z &&
    //         cross(
    //           a.getLinedef().getFirstVertex(),
    //           a.getLinedef().getSecondVertex()
    //         ) > 0
    //       ) {
    //         wn += 1;
    //       }
    //     } else if (
    //       a.getLinedef().getSecondVertex().y <= z &&
    //       cross(
    //         a.getLinedef().getFirstVertex(),
    //         a.getLinedef().getSecondVertex()
    //       ) < 0
    //     ) {
    //       wn -= 1;
    //     }
    //   });

    //   return wn != 0;
    // });

    // return this.things.filter((thing) => {
    //   const { x, z } = thing.getPosition();
    //   let isInside = false;

    //   for (let i = 0, j = sidedefs.length - 1; i < sidedefs.length; j = i++) {
    //     const xi = sidedefs[i].getLinedef().getFirstVertex().x;
    //     const yi = sidedefs[i].getLinedef().getFirstVertex().y;
    //     const xj = sidedefs[j].getLinedef().getFirstVertex().x;
    //     const yj = sidedefs[j].getLinedef().getFirstVertex().y;

    //     const intersect =
    //       yi > z != yj > z && x < ((xj - xi) * (z - yi)) / (yj - yi) + xi;

    //     if (intersect) {
    //       isInside = !isInside;
    //     }
    //   }

    //   return isInside;
    // });

    // return this.things.filter((thing) => {
    //   const { x, z } = thing.getPosition();
    //   let q = new Array(vertices.length);

    //   const det = (index: number) => {
    //     const { start, end } = vertices[index];
    //     // const { end } = vertices[index + 1];
    //     return (start.x - x) * (end.y - z) - (end.x - x) * (start.y - z);
    //   };

    //   for (let i = 0; i < vertices.length; i++) {
    //     const { start } = vertices[i];
    //     // const second = sidedefs[i].getLinedef().getSecondVertex();

    //     if (start.x > x && start.y >= z) {
    //       q[i] = 0;
    //     } else if (start.x <= x && start.y > z) {
    //       q[i] = 1;
    //     } else if (start.x < x && start.y <= z) {
    //       q[i] = 2;
    //     } else if (start.x >= x && start.y < z) {
    //       q[i] = 3;
    //     }
    //   }

    //   q[q.length - 1] = q[0];

    //   let w = 0;
    //   for (let i = 0; i < vertices.length; i++) {
    //     const temp = q[i + 1] - q[i];
    //     if (temp === -3) {
    //       w = w + 1;
    //     } else if (temp === 3) {
    //       w = w - 1;
    //     } else if (temp === -2 && det(i) > 0) {
    //       w = w + 1;
    //     } else if (temp === 2 && det(i) < 0) {
    //       w = w - 1;
    //     }
    //     // if (temp === 1 || temp === -3) {
    //     //   w = w + 1;
    //     // } else if (temp === -1 || temp === 3) {
    //     //   w = w - 1;
    //     // } else if (temp === 2 || temp === -2) {
    //     //   w = w + 2 * Math.sign(det(i));
    //     // }
    //   }

    //   return w != 0;
    // });
  }

  get(): Thing[] {
    return this.things;
  }
}

//  Short 5 of 5, occupying bytes 8-9 of each thing record, control a
// few options, according to which bits are set:

// bit 0   the THING is present at skill 1 and 2
// bit 1   the THING is present at skill 3 (hurt me plenty)
// bit 2   the THING is present at skill 4 and 5 (ultra-violence, nightmare)
// bit 3   indicates a deaf guard.
// bit 4   means the THING only appears in multiplayer mode.

// bits 5-15 have no effect.

//   The skill settings are most used with the monsters, of course...the
// most common skill level settings are hex 07/0f (on all skills), 06/0e
// (on skill 3-4-5), and 04/0c (only on skill 4-5). Unusual skill settings
// are perfectly allowable, e.g. hex 05 for a thing which is present on
// skill 1, 2, 4, and 5, but not skill 3.
//   "deaf guard" only has meaning for monsters, who will not attack until
// they see a player if they are deaf. Otherwise, they will activate when
// they hear gunshots, etc. (including the punch!). Sound does not travel
// through solid walls (walls that are solid at the time of the noise).
// Also, lines can be set so that sound does not pass through them (see
// [4-3-1] bit 6). This option is also known as the "ambush" option (or
// flag, or attribute).
export class Thing {
  private x: number;
  private y: number;
  private z: number;
  private angle: number;
  private options: number;
  private sectorIndex: number;
  typeId: number;
  private _type: { label: string; sprite: string; sequence: string };

  get type() {
    return this._type;
  }

  constructor(index: number, dataView: DataView) {
    this.x = dataView.getInt16(index, true);
    this.y = 0;
    this.z = -dataView.getInt16(index + 2, true);
    this.angle = dataView.getInt16(index + 4, true);
    this.typeId = dataView.getInt16(index + 6, true);
    this.options = dataView.getInt16(index + 8, true);
    this._type = DoomThingTable[this.typeId];
  }

  getPosition(): { x: number; y: number; z: number } {
    const { x, y, z } = this;
    return { x, y, z };
  }

  setSectorIndex(index: number, y: number) {
    this.sectorIndex = index;
    this.y = y;
  }

  getAngle(): number {
    return this.angle;
  }

  toString(): string {
    const { type, x, y, z, angle, options } = this;

    return `type: ${type.label} [${type.sprite}] x: ${x} y: ${y} z: ${z} angle: ${angle} options: ${options}`;
  }
}

// [4-2-1]: Thing Types
// --------------------

//   Short 4 of 5, occupying bytes 6-7 of each thing record, specifies its
// kind. The table below summarizes the different types. They are listed
// in functional groups. You can easily get a numerical-order list by
// extracting this table and SORTing it.

// Dec/Hex The thing's number in decimal and hexadecimal. This is the
// 	  number used in the THINGS lump on a level (ExMy or MAPxx).
// V       Version of DOOM needed to use this object:
// 	  no mark indicates all versions have this object
// r         requires registered DOOM or DOOM 2
// 2         requires DOOM 2
// Spr     The sprite name associated with this thing. This is the first
// 	  four letters of the lumps that are pictures of this thing.
// seq.    The sequence of frames displayed. "-" means it displays nothing.
// 	  Unanimated things will have just an "a" here, e.g. a backpack's
// 	  only picture can be found in the wad under BPAKA0. Animated
// 	  things will show the order that their frames are displayed
// 	  (they cycle back after the last one). So the blue key
// 	  alternates between BKEYA0 and BKEYB0. The soulsphere uses
// 	  SOULA0-SOULB0-C0-D0-C0-B0 then repeats. Thing 15, a dead
// 	  player, is PLAYN0.
// +       Monsters and players and barrels. They can be hurt, and they
// 	  have a more complicated sprite arrangement. See chapter [5].
// CAPITAL Monsters, counts toward the KILL ratio at the end of a level.
// #       An obstacle, players and monsters can't move through it.
// ^       Hangs from the ceiling, or floats (if a monster).
// $       A regular item that players may get.
// !       An artifact item; counts toward the ITEM ratio at level's end.
// 	  Note that 2025, the radiation suit, was an ITEM in version
// 	  1.2, but it is not an ITEM in version 1.666 on. Also note
// 	  that 2022 and 2024, invulnerability and invisibility, do not
// 	  respawn in -altdeath games.

// Dec. Hex  V Spr  seq.     Thing is:

//   -1 ffff   ---- -        (nothing)
//    0 0000   ---- -        (nothing)
//    1 0001   PLAY +        Player 1 start (Player 1 start needed on ALL
// levels)
//    2 0002   PLAY +        Player 2 start (Player starts 2-4 are needed in)
//    3 0003   PLAY +        Player 3 start (cooperative mode multiplayer games)
//    4 0004   PLAY +        Player 4 start
//   11 000b   ---- -        Deathmatch start positions. Should have >= 4/level
//   14 000e   ---- -        Teleport landing. Where players/monsters land when
//   14                        they teleport to the SECTOR containing this thing

// 3004 0bbc   POSS +      # FORMER HUMAN: regular pistol-shooting zombieman
//   84 0054 2 SSWV +      # WOLFENSTEIN SS: guest appearance by Wolf3D blue guy
//    9 0009   SPOS +      # FORMER HUMAN SERGEANT: black armor, shotgunners
//   65 0041 2 CPOS +      # HEAVY WEAPON DUDE: red armor, chaingunners
// 3001 0bb9   TROO +      # IMP: brown, hurl fireballs
// 3002 0bba   SARG +      # DEMON: pink, muscular bull-like chewers
//   58 003a   SARG +      # SPECTRE: invisible version of the DEMON
// 3006 0bbe r SKUL +     ^# LOST SOUL: flying flaming skulls, they really bite
// 3005 0bbd r HEAD +     ^# CACODEMON: red one-eyed floating heads. Behold...
//   69 0045 2 BOS2 +      # HELL KNIGHT: grey-not-pink BARON, weaker
// 3003 0bbb   BOSS +      # BARON OF HELL: cloven hooved minotaur boss
//   68 0044 2 BSPI +      # ARACHNOTRON: baby SPIDER, shoots green plasma
//   71 0047 2 PAIN +     ^# PAIN ELEMENTAL: shoots LOST SOULS, deserves its
// name
//   66 0042 2 SKEL +      # REVENANT: Fast skeletal dude shoots homing missles
//   67 0043 2 FATT +      # MANCUBUS: Big, slow brown guy shoots barrage of
// fire
//   64 0040 2 VILE +      # ARCH-VILE: Super-fire attack, ressurects the dead!
//    7 0007 r SPID +      # SPIDER MASTERMIND: giant walking brain boss
//   16 0010 r CYBR +      # CYBER-DEMON: robo-boss, rocket launcher

//   88 0058 2 BBRN +      # BOSS BRAIN: Horrifying visage of the ultimate demon
//   89 0059 2 -    -        Boss Shooter: Shoots spinning skull-blocks
//   87 0057 2 -    -        Spawn Spot: Where Todd McFarlane's guys appear

// 2005 07d5   CSAW a      $ Chainsaw
// 2001 07d1   SHOT a      $ Shotgun
//   82 0052 2 SGN2 a      $ Double-barreled shotgun
// 2002 07d2   MGUN a      $ Chaingun, gatling gun, mini-gun, whatever
// 2003 07d3   LAUN a      $ Rocket launcher
// 2004 07d4 r PLAS a      $ Plasma gun
// 2006 07d6 r BFUG a      $ Bfg9000
// 2007 07d7   CLIP a      $ Ammo clip
// 2008 07d8   SHEL a      $ Shotgun shells
// 2010 07da   ROCK a      $ A rocket
// 2047 07ff r CELL a      $ Cell charge
// 2048 0800   AMMO a      $ Box of Ammo
// 2049 0801   SBOX a      $ Box of Shells
// 2046 07fe   BROK a      $ Box of Rockets
//   17 0011 r CELP a      $ Cell charge pack
//    8 0008   BPAK a      $ Backpack: doubles maximum ammo capacities

// 2011 07db   STIM a      $ Stimpak
// 2012 07dc   MEDI a      $ Medikit
// 2014 07de   BON1 abcdcb ! Health Potion +1% health
// 2015 07df   BON2 abcdcb ! Spirit Armor +1% armor
// 2018 07e2   ARM1 ab     $ Green armor 100%
// 2019 07e3   ARM2 ab     $ Blue armor 200%
//   83 0053 2 MEGA abcd   ! Megasphere: 200% health, 200% armor
// 2013 07dd   SOUL abcdcb ! Soulsphere, Supercharge, +100% health
// 2022 07e6 r PINV abcd   ! Invulnerability
// 2023 07e7 r PSTR a      ! Berserk Strength and 100% health
// 2024 07e8   PINS abcd   ! Invisibility
// 2025 07e9   SUIT a     (!)Radiation suit - see notes on ! above
// 2026 07ea   PMAP abcdcb ! Computer map
// 2045 07fd   PVIS ab     ! Lite Amplification goggles

//    5 0005   BKEY ab     $ Blue keycard
//   40 0028 r BSKU ab     $ Blue skullkey
//   13 000d   RKEY ab     $ Red keycard
//   38 0026 r RSKU ab     $ Red skullkey
//    6 0006   YKEY ab     $ Yellow keycard
//   39 0027 r YSKU ab     $ Yellow skullkey

// 2035 07f3   BAR1 ab+    # Barrel; not an obstacle after blown up
// 			    (BEXP sprite)
//   72 0048 2 KEEN a+     # A guest appearance by Billy

//   48 0030   ELEC a      # Tall, techno pillar
//   30 001e r COL1 a      # Tall green pillar
//   32 0020 r COL3 a      # Tall red pillar
//   31 001f r COL2 a      # Short green pillar
//   36 0024 r COL5 ab     # Short green pillar with beating heart
//   33 0021 r COL4 a      # Short red pillar
//   37 0025 r COL6 a      # Short red pillar with skull
//   47 002f r SMIT a      # Stalagmite: small brown pointy stump
//   43 002b r TRE1 a      # Burnt tree: gray tree
//   54 0036 r TRE2 a      # Large brown tree

// 2028 07ec   COLU a      # Floor lamp
//   85 0055 2 TLMP abcd   # Tall techno floor lamp
//   86 0056 2 TLP2 abcd   # Short techno floor lamp
//   34 0022   CAND a        Candle
//   35 0023   CBRA a      # Candelabra
//   44 002c r TBLU abcd   # Tall blue firestick
//   45 002d r TGRE abcd   # Tall green firestick
//   46 002e   TRED abcd   # Tall red firestick
//   55 0037 r SMBT abcd   # Short blue firestick
//   56 0038 r SMGT abcd   # Short green firestick
//   57 0039 r SMRT abcd   # Short red firestick
//   70 0046 2 FCAN abc    # Burning barrel

//   41 0029 r CEYE abcb   # Evil Eye: floating eye in symbol, over candle
//   42 002a r FSKU abc    # Floating Skull: flaming skull-rock

//   49 0031 r GOR1 abcb  ^# Hanging victim, twitching
//   63 003f r GOR1 abcb  ^  Hanging victim, twitching
//   50 0032 r GOR2 a     ^# Hanging victim, arms out
//   59 003b r GOR2 a     ^  Hanging victim, arms out
//   52 0034 r GOR4 a     ^# Hanging pair of legs
//   60 003c r GOR4 a     ^  Hanging pair of legs
//   51 0033 r GOR3 a     ^# Hanging victim, 1-legged
//   61 003d r GOR3 a     ^  Hanging victim, 1-legged
//   53 0035 r GOR5 a     ^# Hanging leg
//   62 003e r GOR5 a     ^  Hanging leg
//   73 0049 2 HDB1 a     ^# Hanging victim, guts removed
//   74 004a 2 HDB2 a     ^# Hanging victim, guts and brain removed
//   75 004b 2 HDB3 a     ^# Hanging torso, looking down
//   76 004c 2 HDB4 a     ^# Hanging torso, open skull
//   77 004d 2 HDB5 a     ^# Hanging torso, looking up
//   78 004e 2 HDB6 a     ^# Hanging torso, brain removed

//   25 0019 r POL1 a      # Impaled human
//   26 001a r POL6 ab     # Twitching impaled human
//   27 001b r POL4 a      # Skull on a pole
//   28 001c r POL2 a      # 5 skulls shish kebob
//   29 001d r POL3 ab     # Pile of skulls and candles
//   10 000a   PLAY w        Bloody mess (an exploded player)
//   12 000c   PLAY w        Bloody mess, this thing is exactly the same as 10
//   24 0018   POL5 a        Pool of blood and flesh
//   79 004f 2 POB1 a        Pool of blood
//   80 0050 2 POB2 a        Pool of blood
//   81 0051 2 BRS1 a        Pool of brains
//   15 000f   PLAY n        Dead player
//   18 0012   POSS l        Dead former human
//   19 0013   SPOS l        Dead former sergeant
//   20 0014   TROO m        Dead imp
//   21 0015   SARG n        Dead demon
//   22 0016 r HEAD l        Dead cacodemon
//   23 0017 r SKUL k        Dead lost soul, invisible
// 			      (they blow up when killed)
