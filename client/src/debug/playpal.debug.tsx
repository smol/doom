// import Playpal from 'wad/lumps/Playpal';
import * as Wad from 'wad';

import * as React from "react";
import * as ReactDOM from "react-dom";

interface PlaypalProps {
	playpal: Wad.Playpal;
	// onClick: (e) => void;
}

export module Debug {
	export class Playpal extends React.Component<PlaypalProps, {}> {
		render() {
			var i = 0;
			var swatches = this.props.playpal.getColors().map(element => {
				return <Swatch key={'swatch-' + i} swatchId={i++} colors={element as [{ r: number, g: number, b: number }]}></Swatch>
			});

			return <div id="preview" className="playpal">
				{swatches}
			</div>;
		}
	}
}

class Swatch extends React.Component<{ colors: [{ r: number, g: number, b: number }], swatchId: number }, {}> {
	render() {
		var i = 0;
		var colors = this.props.colors.map(color => {
			return <div key={'#' + this.props.swatchId + '-' + color.r + ',' + color.g + ',' + color.b + '-' + i++ } className="item" style={{ backgroundColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)' }}></div>
		});

		return <div className="swatch">
			{colors}
		</div>;
	}
}