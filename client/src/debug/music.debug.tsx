import * as React from 'react';

interface MusicProps {
	music : Wad.Music;
}

export module Debug {
	export class Music extends React.Component<MusicProps> {
		constructor(props : MusicProps){
			super(props);
		}

		render(){
			return <div>{ this.props.music.getName() }</div>;
		}
	}
}