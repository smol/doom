import { useEffect, useRef } from "react";
import * as Engine from "engine";
import * as Wad from "wad";

interface SectorProps {
  sector: Wad.Sector;
  flats: Wad.Flat[];
  textures: Wad.Textures[];
  things: Wad.Things;
  graphics: Wad.Graphic[];
}

export const Sector = ({
  sector,
  flats,
  textures,
  things,
  graphics,
}: SectorProps) => {
  const canvas3dRef = useRef<HTMLCanvasElement>();
  const container3dRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();
  let cdtObject = { points: [], cdt: [] };

  console.info({ sector, things: things.getThingsFromSector(sector) });
  let bounds = {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity },
  };

  let position = { x: 0, y: 0 };

  const mouseMove = (evt) => {
    if (evt.buttons === 0) {
      return;
    }
    position.x += evt.movementX * 2;
    position.y += evt.movementY * 2;

    render2d();
  };

  const resize = () => {
    canvasRef.current.width = containerRef.current.clientWidth;
    canvasRef.current.height = containerRef.current.clientHeight;
    canvas3dRef.current.width = container3dRef.current.clientWidth;
    canvas3dRef.current.height = container3dRef.current.clientHeight;
  };

  const canvas_arrow = (context, fromx, fromy, tox, toy, r = 2) => {
    var x_center = tox;
    var y_center = toy;

    const theta = Math.atan2(toy - fromy, tox - fromx);
    var angle;
    var x;
    var y;

    angle = theta + (1 / 3) * (2 * Math.PI);
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.moveTo(x_center, y_center);
    context.lineTo(x, y);

    angle = theta - (1 / 3) * (2 * Math.PI);
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.moveTo(x_center, y_center);
    context.lineTo(x, y);
  };

  const foundMinMax = (vertex: { x: number; y: number }) => {
    bounds.min.x = Math.min(bounds.min.x, vertex.x);
    bounds.min.y = Math.min(bounds.min.y, vertex.y);

    bounds.max.x = Math.max(bounds.max.x, vertex.x);
    bounds.max.y = Math.max(bounds.max.y, vertex.y);
  };

  const render2d = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    sector.getSidedefs().forEach((sector) => {
      const first = sector.getLinedef().getFirstVertex();
      const second = sector.getLinedef().getSecondVertex();

      foundMinMax(first);
      foundMinMax(second);
    });

    const translation = {
      x:
        -bounds.min.x +
        canvas.width / 2 +
        (bounds.min.x - bounds.max.x) / 2 +
        position.x,
      y:
        -bounds.min.y +
        canvas.height / 2 +
        (bounds.min.y - bounds.max.y) / 2 +
        position.y,
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(translation.x, translation.y);

    ctx.beginPath();
    ctx.strokeStyle = "white";

    sector.getSidedefs().forEach((sidedef) => {
      const first = sidedef.getLinedef().getFirstVertex();
      const second = sidedef.getLinedef().getSecondVertex();

      ctx.moveTo(first.x, first.y);
      // ctx.arc(first.x, first.y, 5, 0, 2 * Math.PI);
      canvas_arrow(ctx, first.x, first.y, second.x, second.y, 10);
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
    });

    ctx.stroke();
    // ctx.closePath();

    // renderDelaunay();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const renderDelaunay = () => {
    const { points, cdt } = cdtObject;

    if (points.length == 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "red";

    ctx.beginPath();
    ctx.strokeStyle = "blue";

    ctx.moveTo(points[0][0], points[0][1]);
    points.forEach((points, index) => {
      ctx.lineTo(points[0], points[1]);
      ctx.fillText(`${index}:`, points[0] + (index + 15), points[1] - 5);
    });

    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "green";

    // ctx.moveTo(points[0][0], points[0][1]);
    // points.forEach((points) => {
    //   ctx.lineTo(points[0], points[1]);
    // });

    cdt.forEach((cdt) => {
      ctx.moveTo(points[cdt[0]][0], points[cdt[0]][1]);
      ctx.lineTo(points[cdt[1]][0], points[cdt[1]][1]);
      ctx.lineTo(points[cdt[2]][0], points[cdt[2]][1]);

      ctx.fillText(cdt[0], points[cdt[0]][0], points[cdt[0]][1]);
      ctx.fillText(cdt[1], points[cdt[1]][0], points[cdt[1]][1]);
      ctx.fillText(cdt[2], points[cdt[2]][0], points[cdt[2]][1]);
      // ctx.lineTo(points[cdt[0]][0], points[cdt[0]][1]);
    });

    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    window.addEventListener("resize", resize);

    const triangulation = new Engine.Triangulation(sector);
    cdtObject = triangulation.generate();

    resize();

    /** 2D */
    render2d();
    /** END 2D */

    /** 3D */
    const core = new Engine.Core(canvas3dRef.current, null, {
      orbitControl: true,
      showFps: true,
    });

    let sectorObject = new Engine.Sector(sector, flats, things, graphics);

    core.scene.add(sectorObject);

    core.setTextures(textures);

    core.createWalls(
      sector.getSidedefs().map((sidedef) => sidedef.getLinedef())
    );

    const center = sectorObject.getFloor().getCenter();

    core.setCameraPosition({
      x: center.x,
      y: center.y + 300,
      z: center.z + 100,
    });

    // core.setCameraPosition(center);
    core.lookAt(center);

    /** END 3D */

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }} ref={containerRef}>
        <canvas ref={canvasRef} onMouseMove={mouseMove}></canvas>
      </div>
      <div style={{ flex: 1 }} ref={container3dRef}>
        <canvas ref={canvas3dRef}></canvas>
      </div>
    </div>
  );
};
