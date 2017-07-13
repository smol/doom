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
	export class Debug extends React.Component<DebugProps, { currentItem: JSX.Element }> {
		private wad: Wad.Wad;
		private wadBuilder: Wad.Builder;

		private items : [{label: string, component: JSX.Element }];

		constructor(props : DebugProps) {
			super(props, { currentItem: null });

			this.state = { currentItem: null };
			
			this.wadBuilder = props.builder;
			this.wad = props.wad;

			this.items = [
				{label: "PLAYPAL", component: <Playpal.Playpal playpal={ this.wad.getPlaypal() }/> }
			];

			this.selectItem = this.selectItem.bind(this);
		}

		private groups() {
			var groups: HTMLUListElement = document.createElement('ul') as HTMLUListElement;

			// new Playpal.Playpal(this.wad.getPlaypal(), groups);
			// new ColorMap(this.wad.getColorMap(), groups);
			// new Graphics(this.wad.getGraphics(), groups);
			// new Maps(this.wad.getMaps(), groups);

			document.getElementById('treeview').appendChild(groups);
		}

		selectItem(item : JSX.Element) {
			this.setState(prevState => ({
				currentItem : item
			}));
		}

		render() {
			
			var labels = this.items.map((item) => {
				return <li key={ item.label }  onClick={ () => { this.selectItem(item.component) } }>{ item.label }</li>;
			});

			return <div>
				<div id="treeview">
					<ul className="groups">
						{ labels }
					</ul>
				</div>
				<div id="details">
					{ this.state.currentItem }
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


