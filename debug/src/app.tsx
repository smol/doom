import { Component, useEffect, useState } from "react";
import { Debug } from "./debug";
import * as Wad from "wad";
import { WadContext } from "./contextes";

export default class App extends Component<{}, { wad: Wad.Wad }> {
  constructor(props) {
    super(props);

    this.state = {
      wad: null,
    };
  }

  componentDidMount() {
    const builder = new Wad.Builder();
    builder.getParser().onLoad = () => {
      builder.go();
      this.setState({ wad: builder.wad });
    };

    builder.getParser().loadFile("http://localhost:8080/doom.wad");
  }

  render() {
    const { wad } = this.state;

    if (!wad) {
      return null;
    }

    return (
      <WadContext.Provider value={wad}>
        <Debug />;
      </WadContext.Provider>
    );
  }
}
