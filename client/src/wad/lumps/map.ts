/// <reference path="lump.ts" />
/// <reference path="things.ts" />
/// <reference path="vertexes.ts" />
/// <reference path="linedef.ts" />
/// <reference path="sectors.ts" />

module Wad {
	export class Map extends Lump {
		private things: Things;
		private linedefs : Linedefs;
		private vertexes : Vertexes;
		private sectors : Sectors;
		private nodes : Nodes;
		private subsectors : Subsectors;
		private segs : Segs;

		constructor(lump: any, data: any) {
			super(lump, data);

			this.things = null;
			this.linedefs = null;
			this.vertexes = null;
			this.sectors = null;
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

		setSectors(lump: any, data:any){
			this.sectors = new Sectors(lump, data);
		}

		setNodes(lump: any, data: any){
			this.nodes = new Nodes(lump, data, this.subsectors);
		}

		setSubsectors(lump: any, data: any){
			this.subsectors = new Subsectors(lump, data, this.segs);
		}

		setSegs(lump: any, data: any){
			this.segs = new Segs(lump, data);
		}

		getLinedefs() : Linedef[] {
			return this.linedefs.get();
		}

		getNode() : Node {
			return this.nodes.getNode();
		}

		getVertexes() : Vertex[] {
			return this.vertexes.get();
		}

		getThings(): Things { return this.things; }
	}
}
