// import Lump from './Lump';
/// <reference path="lump.ts" />


var DoomThingTable = {
	3004: "zombie",
	9: "sergeant",
	65: "commando",
	3001: "imp",
	3002: "demon",
	58: "spectre",
	3006: "lost soul",
	3005: "cacodemon",
	69: "hell knight",
	3003: "baron of hell",
	66: "revenant",
	67: "mancubus",
	68: "arachnotron",
	71: "pain elemental",
	64: "archvile",
	16: "cyberdemon",
	7: "spider mastermind",
	84: "ss guy",
	87: "spawn target",
	89: "spawn shooter",
	88: "romero head",
	72: "commander keen",
	2001: "shotgun",
	82: "super shotgun",
	2002: "chaingun",
	2003: "rocket launcher",
	2004: "plasma gun",
	2005: "chainsaw",
	2006: "bfg 9000",
	2007: "ammo clip",
	2048: "ammo box",
	2008: "shells",
	2049: "shell box",
	2010: "rocket",
	2046: "rocket box",
	2047: "cell charge",
	17: "cell pack",
	8: "backpack",
	2011: "stimpack",
	2012: "medikit",
	2013: "supercharge",
	2014: "health bonus",
	2015: "armor bonus",
	2018: "green armor",
	2019: "blue armor",
	2022: "invulnerability",
	2023: "berserk",
	2024: "invisibility",
	2025: "radiation suit",
	2026: "computer map",
	2045: "goggles",
	83: "megasphere",
	13: "red keycard",
	6: "yellow keycard",
	5: "blue keycard",
	38: "red skull key",
	39: "yellow skull key",
	40: "blue skull key",
	1: "player 1 start",
	2: "player 2 start",
	3: "player 3 start",
	4: "player 4 start",
	11: "deathmatch start",
	14: "teleport destination",
	10: "gibs 1",
	12: "gibs 2",
	15: "dead marine",
	18: "dead zombie",
	19: "dead sergeant",
	20: "dead imp",
	21: "dead demon",
	22: "dead cacodemon",
	23: "dead lost soul",
	24: "pool of blood",
	25: "impaled human 1",
	26: "impaled human 2",
	27: "skull on pole",
	28: "five skulls",
	29: "skull pile",
	49: "hangman 1",
	50: "hangman 2",
	51: "hangman 3",
	52: "hangman 4",
	53: "hangman 5",
	59: "hangman 2 (passable)",
	60: "hangman 4 (passable)",
	61: "hangman 3 (passable)",
	62: "hangman 5 (passable)",
	63: "hangman 1 (passable)",
	30: "green pillar",
	31: "short green pillar",
	32: "red pillar",
	33: "short red pillar",
	34: "candle",
	35: "candelabra",
	36: "green pillar with heart",
	37: "red pillar with skull",
	41: "eye",
	42: "skull rock",
	43: "gray tree",
	44: "blue torch",
	45: "green torch",
	46: "red torch",
	47: "scrub",
	48: "tech column",
	54: "brown tree",
	55: "short blue torch",
	56: "short green torch",
	57: "short red torch",
	2028: "floor lamp",
	2035: "barrel"
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

module Wad {
	export class Things extends Lump {
		private things: Thing[] = [];

		constructor(lump: any, data: any) {
			super(lump, data);

			for (var i = 0; i < this.dataView.byteLength; i += 10) {
				this.things.push(new Thing(i, this.dataView));
			}
		}
		
		get() : Thing[] {
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
		private angle: number;
		private options : number;
		typeId: number;
		private type: string;

		constructor(index: number, dataView: DataView) {
			this.x = dataView.getInt16(index, true);
			this.y = -dataView.getInt16(index + 2, true);
			this.angle = dataView.getInt16(index + 4, true);
			this.typeId = dataView.getInt16(index + 6, true);
			this.options = dataView.getInt16(index + 8, true);
			this.type = DoomThingTable[this.typeId];

		}

		getType() : string {
			return this.type;
		}

		getPosition() : {x : number, y:number}{
			return { x: this.x, y: this.y };
		}

		getAngle() : number {
			return this.angle;
		}

		toString(): string {
			return 'type: ' + this.type + ' x: ' + this.x + ' y: ' + this.y + ' angle: ' + this.angle + ' options: ' + this.options;
		}
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