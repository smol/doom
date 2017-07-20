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
	export class Builder {
		private parser: Parser;
		private lumps: any[];

		private maps: Map[];

		private wad: Wad;

		private unknownTypes : string[];

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
			this.maps = [];

			for (var i = 0; i < this.lumps.length; i++) {
				var data = this.parser.getDataByLump(this.lumps[i]);
				this.create(this.lumps[i], data, i);

				// this.dispatch(temp, i);
			}

			console.info('UNKNOWN TYPES', this.unknownTypes);
		}

		// private dispatch(lump: Lump, index: number) {
		// 	if (lump == null){
		// 		return;
		// 	}

		// 	if (lump instanceof Map) {
		// 		this.maps.push(lump);
		// 	} else if (lump instanceof Things) {
		// 		this.maps[this.maps.length - 1].setThings(lump);
		// 	} else {
		// 		this.data[this.lumps[index].name] = lump;
		// 	}
		// }

		private create(lump: any, data: any, index: number) {
			var type: string = Type.get(lump, data, this.lumps, index);
			// console.warn(lump.name, type);

			if (lump.name === 'PLAYPAL') {
				this.wad.setPlaypal(lump, data);
			} else if (lump.name === 'COLORMAP') {
				this.wad.setColorMap(lump, data);
			} else if (lump.name === 'ENDOOM') {
				this.wad.setEndoom(lump, data);
			} else if (/^E\dM\d$/.test(lump.name)) {
				this.wad.setMap(lump, data);
			} else if (lump.name === 'THINGS') {
				var maps: Map[] = this.wad.getMaps();

				maps[maps.length - 1].setThings(lump, data);
				return new Things(lump, data);
			} else if (lump.name === 'LINEDEFS'){
				var maps: Map[] = this.wad.getMaps();

				maps[maps.length - 1].setLinedefs(lump, data);
			} else if (/^TEXTURE\d$/.test(lump.name)) {
				this.wad.setTextures(lump, data);
			} else if (lump.name === 'VERTEXES') {
				var maps: Map[] = this.wad.getMaps();

				maps[maps.length - 1].setVertexes(lump, data);
			} else if (lump.name === 'F_START'){
				this.wad.setStartFlats(true);
			} else if (lump.name === 'F_END'){
				this.wad.setStartFlats(false);
			} else if (type === 'FLAT') {
				this.wad.setFlat(lump, data);
			} else if (type === 'GRAPHIC') {
				this.wad.setGraphic(lump, data);
			} else {
				this.unknownTypes.push(lump.name);
			}
		}
	}
}
