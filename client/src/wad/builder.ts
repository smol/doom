/// <reference path="./parser.ts" />
/// <reference path="./wad.ts" />
/// <reference path="./type.ts" />
/// <reference path="./lumps/lump.ts" />
/// <reference path="./lumps/graphic.ts" />
/// <reference path="./lumps/texture.ts" />
/// <reference path="./lumps/map.ts" />
/// <reference path="./lumps/things.ts" />
/// <reference path="./lumps/endoom.ts" />
/// <reference path="./lumps/colormap.ts" />
/// <reference path="./lumps/playpal.ts" />



// // import WadParser from './Parser';
// import Wad from './Wad';
// import Type from './Type';

// import Lump from './lumps/Lump';
// import Graphics from './lumps/Graphic';
// import Texture from './lumps/Texture';
// import Map from './lumps/Map';
// import Things from './lumps/Things';
// import Endoom from './lumps/Endoom';
// import ColorMap from './lumps/ColorMap';
// import Playpal from './lumps/Playpal';

module Wad {
	// if (lump.name === 'PLAYPAL') {
	// 			this.wad.setPlaypal(lump, data);
	// 		} else if (lump.name === 'COLORMAP') {
	// 			this.wad.setColorMap(lump, data);
	// 		} else if (lump.name === 'ENDOOM') {
	// 			this.wad.setEndoom(lump, data);
	// 		} else if (/^E\dM\d$/.test(lump.name)) {
	// 			this.wad.setMap(lump, data);
	// 		} else if (lump.name === 'THINGS') {
	// 			var maps: Map[] = this.wad.getMaps();

	// 			maps[maps.length - 1].setThings(lump, data);
	// 			return new Things(lump, data);
	// 		} else if (lump.name === 'LINEDEFS'){
	// 			var maps: Map[] = this.wad.getMaps();

	// 			maps[maps.length - 1].setLinedefs(lump, data);
	// 		} else if (/^TEXTURE\d$/.test(lump.name)) {
	// 			this.wad.setTextures(lump, data);
	// 		} else if (lump.name === 'VERTEXES') {
	// 			var maps: Map[] = this.wad.getMaps();

	// 			maps[maps.length - 1].setVertexes(lump, data);
	// 		} else if (lump.name === 'F_START'){
	// 			this.wad.setStartFlats(true);
	// 		} else if (lump.name === 'F_END'){
	// 			this.wad.setStartFlats(false);
	// 		} else if (type === 'FLAT') {
	// 			this.wad.setFlat(lump, data);
	// 		} else if (type === 'GRAPHIC') {
	// 			this.wad.setGraphic(lump, data);
	// 		} else {
	// 			this.unknownTypes.push(lump.name);
	// 		}


	interface BuilderFuncs {
		name: string;
		type: string;
		regex: RegExp;
		action: (builder: Builder, lump: any, data: any) => any;
	}

	const FUNCS: BuilderFuncs[] = [
		{ name: 'PLAYPAL', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setPlaypal(lump, data); } },
		{ name: 'COLORMAP', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setColorMap(lump, data); } },
		{ name: 'ENDOOM', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setEndoom(lump, data); } },
		{ name: null, type: null, regex: /^E\dM\d$/, action: (builder: Builder, lump: any, data: any) => { builder.wad.setMap(lump, data); } },
		{ name: 'THINGS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setThings(lump, data); } },
		{ name: 'LINEDEFS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setLinedefs(lump, data); } },
		{ name: 'VERTEXES', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setVertexes(lump, data); } },
		{ name: null, type: null, regex: /^TEXTURE\d$/, action: (builder: Builder, lump: any, data: any) => { builder.wad.setTextures(builder.parser, lump, data);  } },
		{ name: 'F_START', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setStartFlats(true); } },
		{ name: 'F_END', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setStartFlats(false); } },
		{ name: null, type: 'FLAT', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setFlat(lump, data); } },
		{ name: null, type: 'GRAPHIC', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setGraphic(lump, data); } },
		{ name: null, type: 'MUSIC', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setMusic(lump, data); } },
	];

	export class Builder {
		public wad: Wad;
		public parser: Parser;

		private lumps: any[];

		private unknownTypes: string[];

		constructor(parser: Parser) {
			this.parser = parser;

			this.wad = new Wad();
			this.unknownTypes = [];
		}

		getWad(): Wad {
			return this.wad;
		}

		go() {
			this.lumps = this.parser.getLumps();

			for (var i = 0; i < this.lumps.length; i++) {
				var data = this.parser.getDataByLump(this.lumps[i]);
				this.create(this.lumps[i], data, i);
			}

			console.info('UNKNOWN TYPES', this.unknownTypes);
		}

		private create(lump: any, data: any, index: number) : Boolean {
			var type: string = Type.get(lump, data, this.lumps, index);
			// console.warn(lump.name, type);

			for (var i = 0; i < FUNCS.length; i++) {
				if (FUNCS[i].name === lump.name || FUNCS[i].type === type ||
					(FUNCS[i].regex != null && FUNCS[i].regex.test(lump.name))) {
					FUNCS[i].action(this, lump, data);
					break;
				} else {
					this.unknownTypes.push(lump.name);
				}
			}

			return false;
		}
	}
}
