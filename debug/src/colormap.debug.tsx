// import ColorMap from 'wad/lumps/ColorMap';
import * as Wad from 'wad';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ColorMapProps {
	colorMap: Wad.ColorMap;
}

export module Debug {
	export class ColorMap extends React.Component<ColorMapProps, {}> {
		render() {
			var swatches: JSX.Element[] = [];

			for (var i = 0; i < 256; i++) {
				swatches.push(<ColorMapSwatch key={ i } index={i} colorMap={this.props.colorMap.getColors()} />);
			}

			return <div id="preview" className="colormap">
				{swatches}
			</div>;
		}
	}
}

class ColorMapSwatch extends React.Component<{ index: number, colorMap: { r: number, g: number, b: number }[] }, {}> {
	render() {
		var colors: JSX.Element[] = [];

		for (var i = 0; i < 34; i++) {
			var color: { r: number, g: number, b: number } = this.props.colorMap[(i * 256) + this.props.index];
			colors.push(<div key={ (i * 256) + this.props.index }  className="item" style={{ backgroundColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)' }}></div>);
		}

		return <div className="swatch">
			{colors}
		</div>;
	}
}
