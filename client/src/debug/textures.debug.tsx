/// <reference types="wad" />

import * as React from 'react';

import { Debug as Treeview } from './treeview';
import { Debug as Graphic } from './graphic.debug';

interface TexturesProps {
	texture : Wad.Textures;
}

export module Debug {
	export class Textures extends React.Component<TexturesProps> {
		constructor(props : TexturesProps){
			super(props);


		}

		render(){
			let items : any[] = this.props.texture.getGraphic().map( graphic => {
				return { name: graphic.getName(), component: <Graphic.Graphic graphic={ graphic } />, children: null }
			});

			
			return <Treeview.TreeView items={ items }/>;
		}
	}
}