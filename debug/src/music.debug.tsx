import { MusicPlayer } from "engine";
import * as React from "react";
import * as Wad from "wad";

interface MusicProps {
  music: Wad.Music;
}

export class Music extends React.Component<MusicProps> {
  private musicPlayer: MusicPlayer;

  constructor(props: MusicProps) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // let temp = music.getBuffer();

    this.musicPlayer = new MusicPlayer();

    // console.info(temp);
  }

  componentDidMount() {
    const { music } = this.props;
    this.musicPlayer.setMusic(music);
  }

  componentDidUpdate(prevProps) {
    const { music } = this.props;
    this.musicPlayer.pause();

    this.musicPlayer.setMusic(music);
    this.musicPlayer.play();
  }

  start() {
    this.musicPlayer.play();
  }

  stop() {
    this.musicPlayer.pause();
  }

  componentWillUnmount() {
    this.musicPlayer.pause();
  }

  render() {
    return (
      <div>
        TEST
        <div>{this.props.music.getName()}</div>
        <button onClick={this.start}>START</button>
        <button onClick={this.stop}>STOP</button>
      </div>
    );
  }
}
