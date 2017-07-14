/// <reference path="../../.build/wad.d.ts" />
// / <reference path="./playpal.debug.ts" />
// / <reference path="./graphics.debug.ts" />
// / <reference path="./colormap.debug.ts" />
// / <reference path="./maps.debug.ts" />

// import * as Wad from 'Wad';
// import { WadBuilder } from 'builder';

import { Debug as TreeView } from './treeview';
import { Debug as Playpal } from './playpal.debug';
import { Debug as Graphic } from './Graphic.debug';
import { Debug as ColorMap } from './ColorMap.debug';
import { Debug as Endoom } from './Endoom.debug';
import { Debug as Map } from './Map.debug';

import * as React from "react";
import * as ReactDOM from "react-dom";

interface DebugProps {
	wad: Wad.Wad;
	builder: Wad.Builder;
}

module Debug {
	export class Debug extends React.Component<DebugProps, { currentItem: JSX.Element }> {
		private items: [TreeView.TreeData];

		constructor(props: DebugProps) {
			super(props);
			this.state = { currentItem: null };

			this.items = [
				{ label: "PLAYPAL", component: <Playpal.Playpal playpal={this.props.wad.getPlaypal()} />, children: [] },
				{ label: "COLORMAP", component: <ColorMap.ColorMap colorMap={this.props.wad.getColorMap()} />, children: [] },
				{ label: "ENDOOM", component: <Endoom.Endoom endoom={this.props.wad.getEndoom() } />, children: []},
				{ label: "GRAPHICS", component: null, children: this.getGraphics() },
				{ label: "MAPS", component: null, children: this.getMaps() }
			];

			this.selectItem = this.selectItem.bind(this);
		}

		private getMaps() : TreeView.TreeData[] {
			var datas : TreeView.TreeData[] = [];

			datas = this.props.wad.getMaps().map(map => {
				var data : TreeView.TreeData = {
					label: map.getName(),
					component: null,
					children: []
				};

				data.children = [
					{ label: "THINGS", component: <Map.Things things={map.getThings()}/>, children: [] }
				];

				return data;
			});

			return datas;
		}

		private getGraphics() : TreeView.TreeData[] {
			var datas : TreeView.TreeData[] = [];
			var graphics : Wad.Graphic[] = this.props.wad.getGraphics();

			for (var i = 0; i < graphics.length; i++){
				datas.push({ label: graphics[i].getName(), component: <Graphic.Graphic graphic={ graphics[i] } />, children: null });
			}

			return datas;
		}

		private groups() {
			var groups: HTMLUListElement = document.createElement('ul') as HTMLUListElement;

			// new Playpal.Playpal(this.wad.getPlaypal(), groups);
			// new ColorMap(this.wad.getColorMap(), groups);
			// new Graphics(this.wad.getGraphics(), groups);
			// new Maps(this.wad.getMaps(), groups);

			document.getElementById('treeview').appendChild(groups);
		}

		selectItem(item: JSX.Element) {
			this.setState(prevState => ({
				currentItem: item
			}));
		}

		render() {
			return <div>
				<TreeView.TreeView items={ this.items } select={ this.selectItem } />
				<div id="details">
					{this.state.currentItem}
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
		<Debug.Debug wad={builder.getWad()} builder={builder} />,
		document.getElementById("debug")
	);

	// new Debug.Debug(builder.getWad(), builder);
};

parser.loadFile('/client/assets/doom.wad');


