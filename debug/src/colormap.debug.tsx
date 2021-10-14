// import ColorMap from 'wad/lumps/ColorMap';

import { useContext } from "react";
import { Wad } from "wad";
import { WadContext } from "./contextes";

export const ColorMap = () => {
  const { ColorMap } = useContext<Wad>(WadContext);
  const swatches: JSX.Element[] = [];

  for (var i = 0; i < 256; i++) {
    swatches.push(
      <ColorMapSwatch
        key={`swatch-${i}`}
        index={i}
        colorMap={ColorMap.getColors()}
      />
    );
  }

  return (
    <div id="preview" className="colormap">
      {swatches}
    </div>
  );
};

const style: { swatch: React.CSSProperties; item: React.CSSProperties } = {
  swatch: {
    float: "left",
    verticalAlign: "top",

    boxSizing: "border-box",
  },
  item: {
    width: 8,
    height: 8,
  },
};

const ColorMapSwatch = ({
  colorMap,
  index,
}: {
  index: number;
  colorMap: { r: number; g: number; b: number }[];
}) => {
  var colors: JSX.Element[] = [];

  for (var i = 0; i < 34; i++) {
    const color = colorMap[i * 256 + index];

    colors.push(
      <div
        key={i * 256 + index}
        style={{
          ...style.item,
          backgroundColor:
            "rgba(" + color.r + "," + color.g + "," + color.b + ", 1)",
        }}
      />
    );
  }

  return <div style={style.swatch}>{colors}</div>;
};
