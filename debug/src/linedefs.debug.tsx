import { MouseEventHandler, useEffect, useRef, MouseEvent } from "react";
import { Linedef, Vertex, Vertexes, LinedefFlag } from "wad";

interface LinedefsProps {
  current: Linedef;
  linedefs: Linedef[];
  vertexes: Vertex[];
}

export const Linedefs = (props: LinedefsProps) => {
  const { current, linedefs, vertexes } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let position = { x: 500, y: 500 };

  const mouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons === 0) {
      return;
    }

    position.x += event.movementX * 2;
    position.y += event.movementY * 2;

    update();

    // startPosition = { x: event.screenX, y: event.screenY };
  };

  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var scale = 0.5;

    var start: { x: number; y: number } = {
      x: vertexes[linedefs[0].getFirst()].x,
      y: vertexes[linedefs[0].getFirst()].y,
    };

    start.x += position.x;
    start.y += position.y;

    // console.warn('start', start);
    ctx.beginPath();
    linedefs.forEach((linedef) => {
      var firstVertex: Vertex = vertexes[linedef.getFirst()];
      var secondVertex: Vertex = vertexes[linedef.getSecond()];

      ctx.beginPath();
      ctx.strokeStyle = linedef === current ? "red" : "white";

      ctx.moveTo(
        (start.x - firstVertex.x) * scale,
        (start.y - firstVertex.y) * scale
      );
      ctx.lineTo(
        (start.x - secondVertex.x) * scale,
        (start.y - secondVertex.y) * scale
      );

      ctx.stroke();
      ctx.closePath();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    console.info({ current });
    position = {
      x:
        vertexes[current.getFirst()].x -
        vertexes[linedefs[0].getFirst()].x +
        canvas.width / 2,
      y:
        vertexes[current.getFirst()].y -
        vertexes[linedefs[0].getFirst()].y +
        canvas.height / 2,
    };
    update();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div ref={containerRef} style={{ flex: 1 }}>
        <canvas ref={canvasRef} onMouseMove={mouseMove} />
      </div>
    </div>
  );
};
