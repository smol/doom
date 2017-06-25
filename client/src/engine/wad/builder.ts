import WadParser from './Wad';

import Lump from './lumps/Lump';
import ColorMap from './lumps/ColorMap';
import Playpal from './lumps/Playpal';

export default class Builder {
	private parser: WadParser;

	private lumps: { [name: string] : Lump;};

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

		for (var key in this.lumps){
			this.lumps[key].debug(debug);
		}
	}

	private create(lump: any, data: any): Lump {
		if (lump.name === 'PLAYPAL') {
			return new Playpal(lump, data);
		} else if (lump.name === 'COLORMAP'){
			return new ColorMap(this.lumps['PLAYPAL'] as Playpal, lump, data);
		}

		return new Lump(lump, data);
	}
}