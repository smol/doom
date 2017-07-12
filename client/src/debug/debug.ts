/// <reference path="../../.build/wad.d.ts" />
/// <reference path="./playpal.debug.ts" />
/// <reference path="./graphics.debug.ts" />
/// <reference path="./colormap.debug.ts" />
/// <reference path="./maps.debug.ts" />

// import * as Wad from 'Wad';
// import { WadBuilder } from 'builder';

// import PlayPalDebug from './Playpal.debug';
// import GraphicsDebug from './Graphics.debug';
// import ColorMapDebug from './ColorMap.debug';
// import MapsDebug from './Maps.debug';

module Debug {
	export class Debug {
		private wad: Wad.Wad;
		private wadBuilder: Wad.Builder;

		constructor(wad: Wad.Wad, wadBuilder: Wad.Builder) {
			this.wadBuilder = wadBuilder;
			this.wad = wad;

			this.groups();
		}

		private groups() {
			var groups: HTMLUListElement = document.createElement('ul') as HTMLUListElement;

			console.warn('coucou');

			new Playpal(this.wad.getPlaypal(), groups);
			new ColorMap(this.wad.getColorMap(), groups);
			new Graphics(this.wad.getGraphics(), groups);
			new Maps(this.wad.getMaps(), groups);

			document.getElementById('treeview').appendChild(groups);
		}
	}
}
