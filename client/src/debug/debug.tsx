
// / <reference path="./playpal.debug.ts" />
// / <reference path="./graphics.debug.ts" />
// / <reference path="./colormap.debug.ts" />
// / <reference path="./maps.debug.ts" />

// import * as Wad from 'Wad';
// import { WadBuilder } from 'builder';

import { Debug as TreeView } from './treeview';
import { Debug as Playpal } from './playpal.debug';
import { Debug as Graphic } from './graphic.debug';
import { Debug as ColorMap } from './colormap.debug';
import { Debug as Nodes } from './nodes.debug';
import { Debug as Floors } from './floor.debug';
import { Debug as Subsectors } from './subsectors.debug';
import { Debug as Endoom } from './endoom.debug';
import { Debug as Map } from './map.debug';
import { Debug as Music } from './music.debug';
import { Debug as Vertexes } from './vertexes.debug';

import * as Wad from 'wad';
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
				{ label: "ENDOOM", component: <Endoom.Endoom endoom={this.props.wad.getEndoom()} />, children: [] },
				{ label: "GRAPHICS", component: null, children: this.getGraphics() },
				{ label: "MUSICS", component: null, children: this.getMusics() },
				{ label: "MAPS", component: null, children: this.getMaps() }
			];

			this.selectItem = this.selectItem.bind(this);
		}

		private getMaps(): TreeView.TreeData[] {
			var datas: TreeView.TreeData[] = [];

			datas = this.props.wad.getMaps().map(map => {
				var data: TreeView.TreeData = {
					label: map.getName(),
					component: <Map.Map map={map} wad={this.props.wad} />,
					children: []
				};

				data.children = [
					{ label: "THINGS", component: <Map.Things things={map.getThings()} />, children: [] },
					{ label: "VERTEXES", component: <Vertexes.Vertexes vertexes={map.getVertexes()} linedefs={map.getLinedefs()} />, children: [] },
					{ label: "NODES", component: null, children: this.getNodes(map) },
					{ label: "SUBSECTORS", component: <Subsectors.Subsectors subsectors={ map.getSubsectors() }/>, children: [] },
					{ label: "FLOOR", component: <Floors.Floors node={ map.getNode() } sectors={ map.getSectors() } />, children: [] },
				];

				return data;
			});

			return datas;
		}

		private getNodes(map: Wad.Map) : TreeView.TreeData[] {
			var datas : TreeView.TreeData[] = [];
			var nodes : Wad.Node[] = map.getNodes();

			for (var i = 0; i < nodes.length; i++) {
				datas.push({ label: "NODE " + i, component: <Nodes.Nodes vertexes={map.getVertexes()} linedefs={map.getLinedefs()} node={ nodes[i] } />, children: [] });
			}

			return datas;
		}

		private getMusics() : TreeView.TreeData[] {
			var data : TreeView.TreeData[] = [];

			data = this.props.wad.getMusics().map(music => {
				return { label: music.getName(), component: <Music.Music music={ music } />, children: [] };
			});

			return data;
		}

		private getGraphics(): TreeView.TreeData[] {
			var datasGraphics: TreeView.TreeData[] = [];
			var graphics: Wad.Graphic[] = this.props.wad.getGraphics();

			for (var i = 0; i < graphics.length; i++) {
				datasGraphics.push({ label: graphics[i].getName(), component: <Graphic.Graphic graphic={graphics[i]} />, children: null });
			}

			return [
				{ label: "GRAPHICS", component: null, children: datasGraphics },
				{ label: "TEXTURES", component: null, children: this.getTextures() },
				{ label: "FLATS", component: null, children: this.getFlats() }
			];
		}

		private getFlats(): TreeView.TreeData[] {
			var dataFlats: TreeView.TreeData[] = [];
			var flats: Wad.Flat[] = this.props.wad.getFlats();
			for (var i = 0; i < flats.length; i++) {
				dataFlats.push({ label: flats[i].getName(), component: <Graphic.Flat flat={flats[i]} />, children: null });
			}

			return dataFlats;
		}

		private getTextures(): TreeView.TreeData[] {
			var dataTextures: TreeView.TreeData[] = [];
			var textures: Wad.Textures[] = this.props.wad.getTextures();

			for (var i = 0; i < textures.length; i++) {
				var dataTexture : TreeView.TreeData = { label: textures[i].getName(), component: null, children: [] };
				var texturesList : Wad.Texture[] = textures[i].getTextures();

				for (var j = 0; j < texturesList.length; j++){
					dataTexture.children.push({ label: texturesList[j].getName(), component: null, children: null });
				}

				dataTextures.push(dataTexture);
			}

			return dataTextures;
		}

		selectItem(item: JSX.Element) {
			this.setState(prevState => ({
				currentItem: item
			}));
		}

		render() {
			return <div>
				<TreeView.TreeView items={ this.items } select={this.selectItem} />
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


