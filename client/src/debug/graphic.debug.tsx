// import Graphic from 'wad/lumps/Graphic';

import * as Wad from 'wad';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


interface GraphicProps {
	graphic: Wad.Graphic;
}

interface FlatProps {
	flat: Wad.Flat;
}

export module Debug {
	export class Graphic extends React.Component<GraphicProps, {}> {


		constructor(props: GraphicProps) {
			super(props);
		}

		componentDidMount() {
			this.updateCanvas(this.props.graphic);
		}

		private updateCanvas(graphic: Wad.Graphic) {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			canvas.height = graphic.getHeight();
			canvas.width = graphic.getWidth();

			setTimeout(function () {
				var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
				var idata: ImageData = ctx.createImageData(canvas.width, canvas.height);

				idata.data.set(graphic.getImageData());

				ctx.putImageData(idata, 0, 0);
			});
		}

		componentWillReceiveProps(nextProps) {
			this.updateCanvas(nextProps.graphic);
		}

		render() {
			return <canvas className="debug-container endoom" ref="canvas" width={this.props.graphic.getWidth()} height={this.props.graphic.getHeight()}></canvas>;
		}
	}

	export class Flat extends React.Component<FlatProps, {}> {
		constructor(props: FlatProps) {
			super(props);
		}

		componentDidMount() {
			this.updateCanvas(this.props.flat);
		}

		private updateCanvas(flat: Wad.Flat) {
			var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
			canvas.height = flat.getHeight();
			canvas.width = flat.getWidth();

			setTimeout(function () {
				var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
				var idata: ImageData = ctx.createImageData(canvas.width, canvas.height);

				idata.data.set(flat.getImageData());
				
				ctx.putImageData(idata, 0, 0);
			});
		}

		componentWillReceiveProps(nextProps) {
			this.updateCanvas(nextProps.flat);
		}

		render() {
			return <canvas className="debug-container endoom" ref="canvas" width={this.props.flat.getWidth()} height={this.props.flat.getHeight()}></canvas>;
		}
	}
}

