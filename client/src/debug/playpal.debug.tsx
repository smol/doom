// import Playpal from 'wad/lumps/Playpal';
/// <reference path="../../.build/wad.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

export module Debug {
	export class Playpal extends React.Component<{ playpal : Wad.Playpal }, {}> {
		// private playpal: Wad.Playpal;

		constructor(props : { playpal: Wad.Playpal }) {
			super(props, {});

			var self = this;

			// var html: HTMLLIElement = document.createElement('li') as HTMLLIElement;
			// html.innerHTML = 'PLAYPAL';

			// html.onclick = () => {
			// 	self.setPreview();
			// };

			// container.appendChild(html);
		}

		private setPreview() {
			var div: HTMLDivElement = document.getElementById('preview') as HTMLDivElement;

			div.innerHTML = '';

			var temp: HTMLDivElement = document.createElement('div');
			temp.id = 'playpal';
			div.appendChild(temp);

			// this.playpal.getColors().forEach(element => {
			// 	var wrapper = document.createElement('div');
			// 	wrapper.className = 'swatch';

			// 	element.forEach(color => {
			// 		var colorDiv = document.createElement('div');
			// 		colorDiv.className = 'item';

			// 		colorDiv.style.backgroundColor = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';

			// 		wrapper.appendChild(colorDiv);
			// 	});

			// 	temp.appendChild(wrapper);
			// });
		}


		private setInfos() {
			var div: HTMLDivElement = document.getElementById('infos') as HTMLDivElement;
			div.innerHTML = '';
		}

		render() {
			return <li>PLAYPAL</li>;
		}
	}
}

class Swatch extends React.Component<{}, {}> {
	render() {
		return <div className="swatch"></div>;
	}
}