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

module Wad {
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
		{ name: 'NODES', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setNodes(lump, data); } },
		{ name: 'SEGS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setSegs(lump, data); } },
		{ name: 'SECTORS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setSectors(lump, data); } },
		{ name: 'SIDEDEFS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setSidedefs(lump, data); } },
		{ name: 'SSECTORS', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setSubsectors(lump, data); } },
		{ name: 'REJECT', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { var maps: Map[] = builder.wad.getMaps(); maps[maps.length - 1].setReject(lump, data); } },
		{ name: null, type: null, regex: /^TEXTURE\d$/, action: (builder: Builder, lump: any, data: any) => { builder.wad.setTextures(builder.parser, lump, data); } },
		{ name: 'F_START', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setStartFlats(true); } },
		{ name: 'F_END', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setStartFlats(false); } },
		{ name: null, type: 'FLAT', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setFlat(lump, data); } },
		{ name: null, type: 'GRAPHIC', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setGraphic(lump, data); } },
		{ name: null, type: 'MUSIC', regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setMusic(lump, data); } },
		{ name: 'PNAMES', type: null, regex: null, action: (builder: Builder, lump: any, data: any) => { builder.wad.setPnames(lump, data); } },

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

			this.unknownTypes = [];
			for (var i = 0; i < this.lumps.length; i++) {
				var data = this.parser.getDataByLump(this.lumps[i]);
				this.create(this.lumps[i], data, i);
			}

			console.info('WAD', this.wad);

			console.info('UNKNOWN TYPES', this.unknownTypes);
		}

		private create(lump: any, data: any, index: number): Boolean {
			var type: string = Type.get(lump, data, this.lumps, index);

			for (var i = 0; i < FUNCS.length; i++) {
				if (FUNCS[i].name === lump.name || FUNCS[i].type === type ||
					(FUNCS[i].regex != null && FUNCS[i].regex.test(lump.name))) {
					FUNCS[i].action(this, lump, data);
					return true;
				}
			}

			this.unknownTypes.push(lump.name);


			return false;
		}
	}
}
