import { Music } from "wad";
import { mus2midi } from "mus2midi";
import WebAudioTinySynth from "webaudio-tinysynth";

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require("buffer").Buffer;

export class MusicPlayer {
  private synth: WebAudioTinySynth;

  public constructor() {
    this.synth = new WebAudioTinySynth({
      voices: 16,
      useReverb: 0,
      quality: 1,
    });
  }

  public setMusic(music: Music) {
    const midi = mus2midi(new Buffer(music.getBuffer()));
    this.synth.loadMIDI(midi);
  }

  public play() {
    this.synth.playMIDI();
    // this.audioContext.resume();
  }

  public pause() {
    this.synth.stopMIDI();
    // this.audioContext.suspend();
  }
}
