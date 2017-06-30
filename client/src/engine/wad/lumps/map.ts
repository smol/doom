import Lump from './Lump';
import Things from './Things';

export default class Map extends Lump {
	private things : Things;

	constructor(lump: any, data: any){
		super(lump, data);

		this.things = null;
	}

	setThings(things: Things){
		this.things = things;
	}
}