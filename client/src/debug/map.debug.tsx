// import * as React from 'react';

// import Map from 'wad/lumps/Map';


import * as Wad from 'wad';
import * as Engine from 'engine';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ThingsProps {
	things : Wad.Things;
}

interface MapProps {
	map : Wad.Map;
	wad: Wad.Wad;
}

export module Debug {
	export class Things extends React.Component<ThingsProps> {
		render() {
			var i = 0;
			var things : JSX.Element[] = this.props.things.get().map(thing => {
				return <li key={i++}>{ thing.toString() }</li>;
			});


			return <div id="infos">
				<ul>
					{ things }
				</ul>
			</div>;
		}
	}

	export class Map extends React.Component<MapProps> {
		private core : Engine.Core;

		private rendering(){
			this.core = new Engine.Core(this.refs.canvas as HTMLCanvasElement, null, { orbitControl: true, showFps: false });
			this.core.createMap(this.props.map, this.props.wad);

			let things : Wad.Thing[] = this.props.map.getThings().get();
			things.forEach(thing => {
				if (thing.getType() == 'player 1 start'){
					let position : {x : number, y: number} = thing.getPosition();
					this.core.setCameraPosition({ x: position.x, y: 40, z: position.y });

				}
			});
		}

		componentDidMount(){
			this.rendering();
		}

		render(){
			return <canvas ref="canvas" width={ window.innerWidth } height={ window.innerHeight / 2 } style={{ backgroundColor: 'black' }} />;
		}
	}

	// export class Maps {
	// 	private maps: Wad.Map[];

	// 	constructor(maps: Wad.Map[], container: HTMLElement) {
	// 		this.maps = maps;
	// 		var self = this;

	// 		var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
	// 		li.innerHTML = 'MAPS';
	// 		li.onclick = () => {
	// 			self.setMaps();
	// 		};

	// 		container.appendChild(li);
	// 	}

	// 	private setMaps() {
	// 		var subtree = document.getElementsByClassName('subtree');

	// 		if (subtree.length > 0) {
	// 			subtree[0].remove();
	// 		}

	// 		var ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
	// 		ul.className = 'subtree';

	// 		this.maps.forEach((item) => {
	// 			var li = document.createElement('li');
	// 			li.innerHTML = item.getName();
	// 			li.onclick = () => {
	// 				console.warn(item.getThings());
	// 			};
	// 			ul.appendChild(li);
	// 		});

	// 		document.getElementById('treeview').appendChild(ul);
	// 	}
	// }

	// class MapDebug {
	// 	constructor() {

	// 	}
	// }
}
