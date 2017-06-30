import WadParser from './Wad';
import Type from './Type';

import Lump from './lumps/Lump';
import Graphics from './lumps/Graphics';
import Texture from './lumps/Texture';
import Things from './lumps/Things';
import Endoom from './lumps/Endoom';
import ColorMap from './lumps/ColorMap';
import Playpal from './lumps/Playpal';

export default class Builder {
	private parser: WadParser;

	private data: { [name: string]: Lump; };
	private lumps : any[];
	

	constructor(parser: WadParser) {
		this.parser = parser;
	}

	go() {
		this.data = {};

		this.lumps = this.parser.getLumps();

		for (var i = 0; i < this.lumps.length; i++) {
			var data = this.parser.getDataByLump(this.lumps[i]);
			var temp: Lump = this.create(this.lumps[i], data, i);

			this.data[this.lumps[i].name] = temp;
		}
	}

	debug() {
		var debug = document.getElementById('debug') as HTMLDivElement;

		for (var key in this.data) {
			this.data[key].debug(debug);
		}
	}

	private create(lump: any, data: any, index: number): Lump {
		var type : string = Type.get(lump, data, this.lumps, index);
		// console.warn(type);

		if (lump.name === 'PLAYPAL') {
			return new Playpal(lump, data);
		} else if (lump.name === 'COLORMAP') {
			return new ColorMap(this.data['PLAYPAL'] as Playpal, lump, data);
		} else if (lump.name === 'ENDOOM') {
			return new Endoom(lump, data);
		} else if (lump.name === 'THINGS') {
			return new Things(lump, data);
		} else if (lump.name === 'VERTEXES' || lump.name === 'LINEDEFS') {
		} else if (type === 'GRAPHIC') {
			return new Graphics(this.data['PLAYPAL'] as Playpal, lump, data);
		}

		return new Lump(lump, data);
	}
}