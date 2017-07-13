// import ColorMap from 'wad/lumps/ColorMap';
/// <reference path="../../.build/wad.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ColorMapProps {
	colorMap: Wad.ColorMap;
}

module Debug {
	export class ColorMap extends React.Component<ColorMapProps, {}> {
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

		render() {
			var swatches: JSX.Element[] = [];

			for (var i = 0; i < 256; i++) {
				swatches.push(<ColorMapSwatch className="swatch" colorMap={ this.props.colorMap.getColors() } />);
			}

			return <div id="preview" className="colormap">

			</div>;
		}
	}


}

class ColorMapSwatch extends React.Component<ColorMapProps, {}> {
	render() {

	}
}
