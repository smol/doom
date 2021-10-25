import { useEffect, useRef } from "react";
import * as Wad from "wad";

interface SubsectorProps {
  subsector: Wad.Subsector;
}

export const Subsector = ({ subsector }: SubsectorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let bounds = {
      min: { x: Infinity, y: Infinity },
      max: { x: -Infinity, y: -Infinity },
    };

    const foundMinMax = (vertex: { x: number; y: number }) => {
      bounds.min.x = Math.min(bounds.min.x, vertex.x);
      bounds.min.y = Math.min(bounds.min.y, vertex.y);

      bounds.max.x = Math.max(bounds.max.x, vertex.x);
      bounds.max.y = Math.max(bounds.max.y, vertex.y);
    };

    const scale = 1;

    subsector.getSegs().forEach((seg) => {
      const start = seg.getStartVertex();
      const end = seg.getEndVertex();

      foundMinMax(start);
      foundMinMax(end);
    });

    ctx.translate(
      -bounds.min.x + canvas.width / 2 + (bounds.min.x - bounds.max.x) / 2,
      -bounds.min.y + canvas.height / 2 + (bounds.min.y - bounds.max.y) / 2
    );

    ctx.beginPath();
    ctx.fillStyle = "white";

    subsector.getSegs().forEach((seg) => {
      const start = seg.getStartVertex();
      const end = seg.getEndVertex();

      ctx.moveTo(start.x * scale, start.y * scale);
      ctx.lineTo(end.x * scale, end.y * scale);
      ctx.fillText(
        seg.getLinedef().getName(),
        start.x * scale + 10,
        start.y * scale + 10
      );
    });

    ctx.strokeStyle = "white";

    ctx.stroke();

    ctx.closePath();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }} ref={containerRef}>
        <canvas style={{ background: "black" }} ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
