import { useContext } from "react";
import { WadContext } from "./contextes";

export const Playpal = () => {
  const { playpal } = useContext(WadContext);

  return (
    <div id="preview" className="playpal">
      {playpal.getColors().map((element, index) => (
        <Swatch
          key={`swatch-${index}`}
          swatchId={index}
          colors={element as [{ r: number; g: number; b: number }]}
        />
      ))}
    </div>
  );
};

const Swatch = (props: {
  colors: [{ r: number; g: number; b: number }];
  swatchId: number;
}) => {
  const { colors, swatchId } = props;
  const style = {
    display: "inline-block",
    verticalAlign: "top",
    width: "calc(100% / 16)",
    height: "16px",
  };

  return (
    <div
      style={{
        margin: "10px",
        width: "calc(50% - 20px)",
        display: "inline-block",
      }}
    >
      {colors.map((color, index) => (
        <div
          key={`#${swatchId}-${color.r},${color.g},${color.b}-${index}`}
          className="item"
          style={{
            ...style,
            backgroundColor: `rgba(${color.r},${color.g},${color.b}, 1)`,
          }}
        />
      ))}
    </div>
  );
};
