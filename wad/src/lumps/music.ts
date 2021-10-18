import { Lump } from "./lump";

export class Music extends Lump {
  private buffer: ArrayBuffer;

  constructor(lump: any, data: any) {
    super(lump, data);

    this.buffer = data;
  }

  getBuffer(): ArrayBuffer {
    return this.buffer;
  }
}
