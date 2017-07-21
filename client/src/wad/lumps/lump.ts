var groups: { [name: string]: string } = {
	'D_.*': 'D_s',
	'E\\dM\\d': 'ExMx',
	'DEMO\\d': 'Demos',
	'END\\d': 'ENDs',
	'AMMNUM\\d': 'AMMNUMs',
	'STG.*': 'STGs',
	'STT.*': 'STTs',
	'WIA\\d': 'WIAs',
	'STCFN\\d': 'STCFNs',
	'STKEYS\\d': 'STKEYs',
	'DP.*': 'DPs',
	'DS.*': 'DSs',
};

module Wad {
	export class Lump {
		protected lump: any;
		protected data: any;
		protected dataView: DataView;

		protected debugContainer: HTMLElement;

		constructor(lump: any, data: any) {
			this.lump = lump;
			this.data = data;

			this.dataView = new DataView(this.data);
		}

		getName(): string {
			if (this.lump === null)
				return "NOTHING";
			return this.lump.name;
		}
	}
}
