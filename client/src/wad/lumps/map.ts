/// <reference path="lump.ts" />
/// <reference path="things.ts" />
/// <reference path="vertexes.ts" />


module Wad {
	export class Map extends Lump {
		private things: Things;
		private linedefs : Linedefs;
		private vertexes : Vertexes;

		constructor(lump: any, data: any) {
			super(lump, data);

			this.things = null;
			this.linedefs = null;
			this.vertexes = null;
		}

		setThings(lump: any, data: any) {
			this.things = new Things(lump, data);
		}

		setLinedefs(lump: any, data: any){
			this.linedefs = new Linedefs(lump, data);
		}

		setVertexes(lump: any, data: any){
			this.vertexes = new Vertexes(lump, data);
		}

		getLinedefs() : Linedef[] {
			return this.linedefs.get();
		}

		getVertexes() : Vertex[] {
			return this.vertexes.get();
		}

		getThings(): Things { return this.things; }
	}
}
