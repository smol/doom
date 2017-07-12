// import ColorMap from 'wad/lumps/ColorMap';
/// <reference path="../../.build/wad.d.ts" />

module Debug {
	export class ColorMap {
		private colorMap: Wad.ColorMap;

		constructor(colorMap: Wad.ColorMap, container: HTMLElement) {
			this.colorMap = colorMap;
			var self = this;

			var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
			li.innerHTML = 'COLORMAP';
			container.appendChild(li);

			li.onclick = () => {
				self.setPreview();
			};
		}

		private setPreview() {
			var div: HTMLDivElement = document.getElementById('preview') as HTMLDivElement;

			div.innerHTML = '';
			div.className = 'colormap';

			var colors: any[] = this.colorMap.getColors();

			for (var i = 0; i < 256; i++) {
				var wrapper = document.createElement('div');
				wrapper.className = 'swatch';

				for (var j = 0; j < 34; j++) {
					var colorDiv = document.createElement('div');
					colorDiv.className = 'item';

					var color: any = colors[(j * 256) + i];

					colorDiv.style.backgroundColor = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
					wrapper.appendChild(colorDiv);
				}


				div.appendChild(wrapper);
			}
		}

		private setInfos() {

		}
	}
}
