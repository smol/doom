// import * as React from 'react';

// import Map from 'wad/lumps/Map';

/// <reference path="../../.build/wad.d.ts" />

module Debug {
	export class Maps {
		private maps: Wad.Map[];

		constructor(maps: Wad.Map[], container: HTMLElement) {
			this.maps = maps;
			var self = this;

			var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
			li.innerHTML = 'MAPS';
			li.onclick = () => {
				self.setMaps();
			};

			container.appendChild(li);
		}

		private setMaps() {
			var subtree = document.getElementsByClassName('subtree');

			if (subtree.length > 0) {
				subtree[0].remove();
			}

			var ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
			ul.className = 'subtree';

			this.maps.forEach((item) => {
				var li = document.createElement('li');
				li.innerHTML = item.getName();
				li.onclick = () => {
					console.warn(item.getThings());
				};
				ul.appendChild(li);
			});

			document.getElementById('treeview').appendChild(ul);
		}
	}

	class MapDebug {
		constructor() {

		}
	}
}
