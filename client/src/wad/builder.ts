import WadParser from './Parser';
import Wad from './Wad';
import Type from './Type';

import Lump from './lumps/Lump';
import Graphics from './lumps/Graphic';
import Texture from './lumps/Texture';
import Map from './lumps/Map';
import Things from './lumps/Things';
import Endoom from './lumps/Endoom';
import ColorMap from './lumps/ColorMap';
import Playpal from './lumps/Playpal';

export default class Builder {
	private parser: WadParser;
	private lumps: any[];

	private maps: Map[];

	private wad : Wad;

	constructor(parser: WadParser) {
		this.parser = parser;

		this.wad = new Wad();
	}

	getWad() : Wad {
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

		if (lump.name === 'PLAYPAL') {
			this.wad.setPlaypal(lump, data);
		} else if (lump.name === 'COLORMAP') {
			this.wad.setColorMap(lump, data);
		} else if (lump.name === 'ENDOOM') {
			this.wad.setEndoom(lump, data);
		} else if (/^E\dM\d$/.test(lump.name)) {
			this.wad.setMap(lump, data);
		} else if (lump.name === 'THINGS') {
			var maps : Map[] = this.wad.getMaps();

			maps[maps.length - 1].setThings(lump, data);
			return new Things(lump, data);
		} else if (lump.name === 'VERTEXES' || lump.name === 'LINEDEFS') {
		} else if (type === 'GRAPHIC') {
			this.wad.setGraphic(lump, data);
		}
	}
}