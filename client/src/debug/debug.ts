import Wad from '../engine/wad/Wad';
import WadBuilder from '../engine/wad/Builder';

import PlayPalDebug from './Playpal.debug';
import GraphicsDebug from './Graphics.debug';
import ColorMapDebug from './ColorMap.debug';
import MapsDebug from './Maps.debug';

export default class Debug {
	private wad : Wad;
	private wadBuilder : WadBuilder;

	constructor(wad: Wad, wadBuilder: WadBuilder){
		this.wadBuilder = wadBuilder;
		this.wad = wad;

		this.groups();
	}

	private groups() {
		var groups : HTMLUListElement = document.createElement('ul') as HTMLUListElement;
		
		new PlayPalDebug(this.wad.getPlaypal(), groups);
		new ColorMapDebug(this.wad.getColorMap(), groups);
		new GraphicsDebug(this.wad.getGraphics(), groups);
		new MapsDebug(this.wad.getMaps(), groups);

		document.getElementById('treeview').appendChild(groups);
	}
}