import { Graphic } from "./graphic";
import { Lump } from "./lump";
import { Textures } from "./textures";

export class Pname {
  private name: string;
  private graphic: Graphic;

  constructor(offset: number, data: DataView) {
    this.name = "";

    for (var b = 0; b < 8; b++) {
      let charcode = data.getUint8(offset + b);
      if (charcode == 0) break;

      this.name += String.fromCharCode(charcode);
    }
    this.name = this.name.toUpperCase();

    // console.info(graphics);
    // for (var i = 0; i < graphics.length; i++){
    // 	if (graphics[i].getName()){
    // 		this.graphic = graphics[i];
    // 		break;
    // 	}
    // }
  }

  getName(): string {
    return this.name;
  }

  setGraphic(graphic: Graphic) {
    this.graphic = graphic;
  }

  getGraphics(): Graphic {
    return this.graphic;
  }
}

export class Pnames extends Lump {
  private pnames: Pname[];

  constructor(lump: any, data: any) {
    super(lump, data);

    let count: number = this.dataView.getUint32(0, true);

    this.pnames = [];
    for (var i = 0; i < count; i++) {
      let offset: number = i * 8 + 4;

      this.pnames.push(new Pname(offset, this.dataView));
    }
  }

  setGraphic(graphic: Graphic) {
    this.pnames.forEach((pname) => {
      if (graphic.getName() == pname.getName()) {
        pname.setGraphic(graphic);
      }
    });
  }

  get(): Pname[] {
    return this.pnames;
  }
}
