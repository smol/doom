import { Texture } from './texture';
import { Lump } from './lump';
import { Parser } from '../parser';
import { Playpal } from './playpal';

export class Textures extends Lump {
  private count: number;
  private offset: number;

  private textures: Texture[];

  constructor(parser: Parser, playpal: Playpal, lump: any, data: any) {
    super(lump, data);

    this.count = this.dataView.getUint32(0, true);
    this.offset = this.dataView.getUint32(4, true);

    this.textures = [];

    var tempOffset: number = this.offset + lump.pos;

    // console.info('OFFSET', tempOffset);

    for (var i = 0; i < this.count; i++) {
      var data = parser.getDataByOffset(tempOffset, 5000);
      let texture = new Texture(playpal, data);
      this.textures.push(texture);

      tempOffset += texture.getSize();
    }

    // console.info('TEXTURE', lump.name, this.count, this.offset);
  }

  setPnames(pnames: string[]) {
    // for (var i = 0; i < pnames.length; i++){
    // 	for (var j = 0; j < this.textures.length; j++){
    // 		if (pnames[i] === this.textures[j].getName()){
    // 			this.textures[j].setPnames(p)
    // 		}
    // 	}
    // }
  }

  getTextureByName(name: string): Texture {
    for (var i = 0; i < this.textures.length; i++) {
      if (name === this.textures[i].getName()) {
        return this.textures[i];
      }
    }

    return null;
  }

  getTextures(): Texture[] {
    return this.textures;
  }
}
