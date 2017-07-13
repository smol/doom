/// <reference path="../../.build/wad.d.ts" />
// / <reference path="./playpal.debug.ts" />
// / <reference path="./graphics.debug.ts" />
// / <reference path="./colormap.debug.ts" />
// / <reference path="./maps.debug.ts" />

// import * as Wad from 'Wad';
// import { WadBuilder } from 'builder';

import { Debug as Playpal } from './playpal.debug';
// import GraphicsDebug from './Graphics.debug';
// import ColorMapDebug from './ColorMap.debug';
// import MapsDebug from './Maps.debug';

import * as React from "react";
import * as ReactDOM from "react-dom";

interface DebugProps {
	wad: Wad.Wad;
	builder: Wad.Builder;
}

module Debug {
	export class Debug extends React.Component<DebugProps, {}> {
		private wad: Wad.Wad;
		private wadBuilder: Wad.Builder;

		constructor(props : DebugProps) {
			super(props, {});

			this.wadBuilder = props.builder;
			this.wad = props.wad;
			// console.warn('toto');
		}

		private groups() {
			var groups: HTMLUListElement = document.createElement('ul') as HTMLUListElement;

			// new Playpal.Playpal(this.wad.getPlaypal(), groups);
			// new ColorMap(this.wad.getColorMap(), groups);
			// new Graphics(this.wad.getGraphics(), groups);
			// new Maps(this.wad.getMaps(), groups);

			document.getElementById('treeview').appendChild(groups);
		}

		render() {
			console.warn('coucou');
			return <div>
				<div id="treeview">
					<ul className="groups">
						<Playpal.Playpal playpal={ this.wad.getPlaypal() } />
					</ul>
				</div>
				<div id="details">
					<div id="preview" ref="preview"></div>
					<div id="infos"></div>
				</div>
			</div>;
		}
	}
}

var parser = new Wad.Parser();
var builder = new Wad.Builder(parser);

parser.onLoad = () => {
	builder.go();

	ReactDOM.render(
		<Debug.Debug wad={builder.getWad() } builder={ builder }/>,
		document.getElementById("debug")
	);

	// new Debug.Debug(builder.getWad(), builder);
};

parser.loadFile('/client/assets/doom.wad');


