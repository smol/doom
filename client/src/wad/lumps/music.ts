module Wad {
	export class Music extends Lump {
		private numberOfBytesMusic : number;
		private numberOfBytesHeader : number;
		private primaryChannelsCount : number;
		private secondaryChannelsCount : number;

		constructor(lump: any, data: any){
			super(lump, data);

			this.numberOfBytesMusic = this.dataView.getUint8(4);
			this.numberOfBytesHeader = this.dataView.getUint8(6);
			this.primaryChannelsCount = this.dataView.getUint8(8);
			this.secondaryChannelsCount = this.dataView.getUint8(10);
			// console.info(this.lump.name, this.numberOfBytesMusic);
		}
	}
}