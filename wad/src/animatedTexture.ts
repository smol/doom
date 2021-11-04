import { Texture } from "./lumps";

export class AnimatedTexture {
  private _textures: Texture[];
  private _slug: string;

  public get slug() {
    return this._slug;
  }

  constructor(slug) {
    this._slug = slug;
    this._textures = [];
  }

  addTexture(texture: Texture) {
    this._textures.push(texture);
  }
}
