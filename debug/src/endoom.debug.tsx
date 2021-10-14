import { useContext, useEffect, useRef } from "react";
import { Wad } from "wad";
import { WadContext } from "./contextes";

export const Endoom = () => {
  const canvasRef = useRef(null);
  const { Endoom } = useContext<Wad>(WadContext);
  const data = Endoom.getData();

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    const idata: ImageData = ctx.createImageData(canvas.width, canvas.height);
    idata.data.set(data);

    ctx.putImageData(idata, 0, 0);
  });

  return (
    <canvas
      ref={canvasRef}
      className="debug-container endoom"
      height={25 * 16}
      width={80 * 8}
    ></canvas>
  );
};
