import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Wad from 'wad';

interface EndoomProps {
	endoom : Wad.Endoom;
}

export module Debug {
	export class Endoom extends React.Component<EndoomProps, {}> {
		componentDidMount(){
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;

			var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
			var idata: ImageData = ctx.createImageData(canvas.width, canvas.height);

			idata.data.set(this.props.endoom.getData());

			ctx.putImageData(idata, 0, 0);
		}

		render() {
			return <canvas ref="canvas" className="debug-container endoom" height={ 25 * 16 } width={80 * 8 }></canvas>;
		}
	}
}
