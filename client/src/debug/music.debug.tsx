import * as React from 'react';

interface MusicProps {
	music: Wad.Music;
}

export module Debug {
	export class Music extends React.Component<MusicProps> {
		private audioContext : AudioContext;
		private node: AudioBufferSourceNode;

		constructor(props: MusicProps) {
			super(props);

			this.audioContext = new AudioContext();
			this.node = this.audioContext.createBufferSource();

			// let temp : Uint8Array = this.props.music.getBuffer();

			// console.info(temp);

			// let buffer: AudioBuffer = this.audioContext.createBuffer(1, temp.length, this.audioContext.sampleRate);
			// let data: Float32Array = buffer.getChannelData(0);

			// for (var i = 0; i < temp.length; i++) {
			// 	console.info(temp[i]);
			// 	data[i] = temp[i];
			// }

			// this.node.buffer = buffer;
			// this.node.loop = true;
			// this.node.connect(this.audioContext.destination);

			// this.start = this.start.bind(this);
			// this.stop = this.stop.bind(this);
			// this.node.start(0);

			// this.audioContext.suspend();

			// context.decodeAudioData(this.props.music.getBuffer(), (buffer : AudioBuffer) => {
			// 	source.buffer = buffer;
			// 	source.connect(context.destination);
			// 	source.start(0);
			// }, (error : DOMException) => {
			// 	console.info('ERROR BUFFER', error);
			// });
		}

		componentDidMount(){

		}

		start(){
			this.audioContext.resume();
		}

		stop(){
			this.audioContext.suspend();
		}

		componentWillUnmount() {
			this.node.stop();
		}

		render() {
			return <div>
				<div>{this.props.music.getName()}</div>
				<button onClick={ this.start }>START</button>
				<button onClick={ this.stop }>STOP</button>
			</div>;
		}
	}
}