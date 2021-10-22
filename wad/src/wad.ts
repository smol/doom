import { Playpal } from "./lumps/playpal";
import { ColorMap } from "./lumps/colormap";
import { Endoom } from "./lumps/endoom";
import { Map } from "./lumps/map";
import { Graphic } from "./lumps/graphic";
import { Music } from "./lumps/music";
import { Textures } from "./lumps/textures";
import { Flat } from "./lumps/flat";
import { Pnames } from "./lumps/pnames";
import { Parser } from "./parser";

export class Wad {
  private playpal: Playpal;
  private colorMap: ColorMap;
  private endoom: Endoom;

  private maps: Map[];

  private graphics: Graphic[];
  private musics: Music[];

  private textures: Textures[];
  private flats: Flat[];
  private pnames: Pnames;

  private flatsStarted: Boolean = false;

  constructor() {
    this.graphics = [];
    this.maps = [];

    this.flats = [];
    this.textures = [];
    this.musics = [];
  }

  onEnded() {
    this.textures.forEach((textures) => {
      textures.setPnames(this.pnames.get());
    });
  }

  setPlaypal(lump: any, data: any) {
    this.playpal = new Playpal(lump, data);
  }

  setColorMap(lump: any, data: any) {
    this.colorMap = new ColorMap(this.playpal, lump, data);
  }

  setEndoom(lump: any, data: any) {
    this.endoom = new Endoom(lump, data);
  }

  setGraphic(lump: any, data: any) {
    let graphic = new Graphic(this.playpal, lump, data, this.pnames);

    this.graphics.push(graphic);
  }

  setPnames(lump: any, data: any) {
    this.pnames = new Pnames(lump, data);
  }

  setFlat(lump: any, data: any) {
    // console.info('HI', this.textures[i], lump.name);

    if (this.flatsStarted) this.flats.push(new Flat(this.playpal, lump, data));
  }

  setMap(lump: any, data: any) {
    this.maps.push(new Map(lump, data));
  }

  setStartFlats(started: Boolean) {
    this.flatsStarted = started;
  }

  setMusic(lump: any, data: any) {
    this.musics.push(new Music(lump, data));
  }

  setTextures(parser: Parser, lump: any, data: any) {
    let textures: Textures = new Textures(parser, this.playpal, lump, data);

    // console.info(textures.getTextures());
    this.textures.push(textures);
  }

  public get ColorMap() {
    return this.colorMap;
  }

  getPlaypal(): Playpal {
    return this.playpal;
  }

  public get Endoom(): Endoom {
    return this.endoom;
  }
  getGraphics(): Graphic[] {
    return this.graphics;
  }
  getFlats(): Flat[] {
    return this.flats;
  }
  getMaps(): Map[] {
    return this.maps;
  }
  getTextures(): Textures[] {
    return this.textures;
  }
  getMusics(): Music[] {
    return this.musics;
  }
}
