import ColorMap from '../engine/wad/lumps/ColorMap';

export default class ColorMapDebug {
	private colorMap : ColorMap;

	constructor(colorMap: ColorMap, container: HTMLElement){
		this.colorMap = colorMap;
		var self = this;

		var li : HTMLLIElement = document.createElement('li') as HTMLLIElement;
		li.innerHTML = 'COLORMAP';
		container.appendChild(li);

		li.onclick = () => {
			self.setPreview();
		};
	}

	private setPreview(){

	}

	private setInfos(){

	}
}