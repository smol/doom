import { Lump } from './lump';
import { Things } from './things';
import { Linedefs, Linedef } from './linedef';
import { Vertexes, Vertex } from './vertexes';
import { Sectors, Sector } from './sectors';
import { Nodes, Node } from './nodes';
import { Subsectors, Subsector } from './subsector';
import { Segs } from './segs';
import { Sidedefs } from './sidedefs';
import { Rejects } from './reject';

export class Map extends Lump {
  private things: Things;
  private linedefs: Linedefs;
  private vertexes: Vertexes;
  private sectors: Sectors;
  private nodes: Nodes;
  private subsectors: Subsectors;
  private segs: Segs;
  private sidedefs: Sidedefs;
  private rejects: Rejects;

  constructor(lump: any, data: any) {
    super(lump, data);

    this.things = null;
    this.linedefs = null;
    this.vertexes = null;
    this.sectors = null;
    this.rejects = null;
  }

  setThings(lump: any, data: any) {
    this.things = new Things(lump, data);
  }

  setLinedefs(lump: any, data: any) {
    this.linedefs = new Linedefs(lump, data);
  }

  setVertexes(lump: any, data: any) {
    this.vertexes = new Vertexes(lump, data);
  }

  setSectors(lump: any, data: any) {
    this.sectors = new Sectors(
      lump,
      data,
      this.sidedefs.get(),
      this.linedefs.get()
    );
  }

  setNodes(lump: any, data: any) {
    this.nodes = new Nodes(lump, data, this.subsectors);
  }

  setReject(lump: any, data: any) {
    this.rejects = new Rejects(lump, data, this.sectors);
  }

  setSidedefs(lump: any, data: any) {
    this.sidedefs = new Sidedefs(lump, data, this.linedefs.get());
  }

  setSubsectors(lump: any, data: any) {
    this.subsectors = new Subsectors(lump, data, this.segs);
  }

  setSegs(lump: any, data: any) {
    this.segs = new Segs(lump, data, this.vertexes.get(), this.linedefs.get());
  }

  getSubsectors(): Subsector[] {
    return this.subsectors.get();
  }

  getSectors(): Sector[] {
    return this.sectors.get();
  }

  getLinedefs(): Linedef[] {
    return this.linedefs.get();
  }

  getNode(): Node {
    return this.nodes.getNode();
  }

  getNodes(): Node[] {
    return this.nodes.getNodes();
  }

  getVertexes(): Vertex[] {
    return this.vertexes.get();
  }

  getThings(): Things {
    return this.things;
  }
}
