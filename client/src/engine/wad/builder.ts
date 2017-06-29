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

	private lumps: { [name: string]: Lump; };

	constructor(parser: WadParser) {
		this.parser = parser;
	}

	go() {
		this.lumps = {};

		var lumps: any[] = this.parser.getLumps();

		for (var i = 0; i < lumps.length; i++) {
			var data = this.parser.getDataByLump(lumps[i]);
			var temp: Lump = this.create(lumps[i], data);

			this.lumps[lumps[i].name] = temp;
		}
	}

	debug() {
		var debug = document.getElementById('debug') as HTMLDivElement;

		for (var key in this.lumps) {
			this.lumps[key].debug(debug);
		}
	}

	private create(lump: any, data: any): Lump {
		var type : string = Type.get(lump, data);
		// console.warn(type);

		if (lump.name === 'PLAYPAL') {
			return new Playpal(lump, data);
		} else if (lump.name === 'COLORMAP') {
			return new ColorMap(this.lumps['PLAYPAL'] as Playpal, lump, data);
		} else if (lump.name === 'ENDOOM') {
			return new Endoom(lump, data);
		} else if (lump.name === 'THINGS') {
			return new Things(lump, data);
		} else if (type === 'GRAPHIC') {
			return new Graphics(this.lumps['PLAYPAL'] as Playpal, lump, data);
		}

		return new Lump(lump, data);
	}
}