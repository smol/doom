import Lump from './Lump';
import Things from './Things';

export default class Map extends Lump {
	private things : Things;

	constructor(lump: any, data: any){
		super(lump, data);

		this.things = null;
	}

	setThings(lump: any, data: any){
		this.things = new Things(lump, data);
	}

	getThings() : Things { return this.things; }
}