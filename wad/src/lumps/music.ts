import { Lump } from './lump';

export class Music extends Lump {
  private buffer: ArrayBuffer;

  constructor(lump: any, data: any) {
    super(lump, data);

    // let converter = new MusToMidi(this.dataView);
    // this.buffer = converter.getMasterOutput();
    // console.info(this.buffer);
  }

  getBuffer(): ArrayBuffer {
    return this.buffer;
  }
}
