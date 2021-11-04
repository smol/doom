import { Texture } from "./texture";
import { Lump } from "./lump";
import { Parser } from "../parser";
import { Playpal } from "./playpal";
import { Pname } from "./pnames";
import { AnimatedTexture } from "../animatedTexture";

export class Textures extends Lump {
  private count: number;
  private offset: number;

  private textures: Texture[];

  private _animated: AnimatedTexture[];

  constructor(parser: Parser, playpal: Playpal, lump: any, data: any) {
    super(lump, data);

    this.count = this.dataView.getUint32(0, true);
    this.offset = this.dataView.getUint32(4, true);

    this.textures = [];

    var tempOffset: number = this.offset + lump.pos;

    const animationsSlug = [
      "BLODGR",
      "BLODRIP",
      "FIREBLU",
      "FIRELAV",
      "FIREMAG",
      "FIREWAL",
      "GSTFONT",
      "ROCKRED",
      "SLADRIP",
      "BFALL",
      "SFALL",
      "WFALL",
      "DBRAIN",

      "NUKAGE",
      "FWATER",
      "SWATER",
      "LAVA",
      "BLOOD",
    ];

    this._animated = animationsSlug.map((slug) => new AnimatedTexture(slug));

    // console.info('OFFSET', tempOffset);

    for (var i = 0; i < this.count; i++) {
      var data = parser.getDataByOffset(tempOffset, 5000);
      let texture = new Texture(playpal, data);

      const animationIndex = this.findAnimated(texture.getName());
      if (animationIndex > -1) {
        texture.setAnimationIndex(animationIndex);
        this._animated[animationIndex].addTexture(texture);
      }
      this.textures.push(texture);
      tempOffset += texture.getOffset();
    }

    console.info(this._animated);
    // console.info('TEXTURE', lump.name, this.count, this.offset);
  }

  findAnimated(textureName: string) {
    for (let i = 0; i < this._animated.length; i++) {
      if (textureName.includes(this._animated[i].slug)) {
        return i;
      }
    }

    return -1;
  }

  setPnames(pnames: Pname[]) {
    this.textures.forEach((texture) => {
      texture.setPnames(pnames);
    });
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
