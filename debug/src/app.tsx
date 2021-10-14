import { useEffect, useState } from "react";
import { Debug } from "./debug";
import * as Wad from "wad";
import { WadContext } from "./contextes";

export default () => {
  const [builder, setBuilder] = useState<Wad.Builder>(null);
  const [wad, setWad] = useState(null);

  useEffect(() => {
    var builder = new Wad.Builder();
    setBuilder(builder);

    builder.getParser().onLoad = () => {
      builder.go();

      setWad(builder.wad);
    };

    builder.getParser().loadFile("http://localhost:8080/doom.wad");
  }, []);

  if (!builder || !wad) return null;

  console.info({ wad });

  return (
    <WadContext.Provider value={wad}>
      <Debug builder={builder} />;
    </WadContext.Provider>
  );
};
