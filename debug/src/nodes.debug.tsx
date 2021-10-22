import { useEffect, useRef } from "react";
import * as Wad from "wad";
import { WadContext } from "./contextes";

interface NodesProps {
  node: Wad.Node;
  linedefs: Wad.Linedef[];
  vertexes: Wad.Vertex[];
}

// export class Node extends React.Component<NodesProps> {
//   constructor(props: NodesProps) {
//     super(props);
//   }
// }

export const Node = ({ node, linedefs, vertexes }: NodesProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  let scale = 1;

  let bounds = {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity },
  };

  const foundMinMax = (node: Wad.Node) => {
    const leftBounds = node.getLeftBounds();
    const rightBounds = node.getRightBounds();

    bounds.min.x = Math.min(
      bounds.min.x,
      Math.min(leftBounds.lX, rightBounds.lX)
    );
    bounds.min.y = Math.min(
      bounds.min.y,
      Math.min(leftBounds.lY, rightBounds.lY)
    );

    bounds.max.x = Math.max(
      bounds.max.x,
      Math.max(leftBounds.uX, rightBounds.uX)
    );
    bounds.max.y = Math.max(
      bounds.max.y,
      Math.max(leftBounds.uY, rightBounds.uY)
    );
  };

  const scroll = (evt) => {};

  const mouseMove = (evt) => {};

  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    foundMinMax(node);

    const translate = {
      x: bounds.min.x - canvas.width / 2 + (bounds.min.x - bounds.max.x) / 2,
      y: bounds.min.y + canvas.height / 2 - (bounds.min.y - bounds.max.y) / 2,
    };

    // console.info(bounds, translate.x, translate.y, node);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(translate.x, translate.y);

    // ctx.translate(500, -2500);

    ctx.beginPath();

    linedefs.forEach((linedef) => {
      var firstVertex: Wad.Vertex = vertexes[linedef.getFirst()];
      var secondVertex: Wad.Vertex = vertexes[linedef.getSecond()];

      // console.info(firstVertex.x, firstVertex.y);
      // ctx.strokeStyle = linedef === current ? "red" : "white";

      ctx.moveTo(firstVertex.x * scale, firstVertex.y * scale);
      ctx.lineTo(secondVertex.x * scale, secondVertex.y * scale);
    });

    ctx.strokeStyle = "white";

    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "blue";

    const rightSector = node.getRightSubsector();
    if (rightSector) {
      rightSector.getSegs().forEach((seg) => {
        var firstVertex: Wad.Vertex = seg.getStartVertex();
        var secondVertex: Wad.Vertex = seg.getEndVertex();

        ctx.moveTo(firstVertex.x * scale, firstVertex.y * scale);
        ctx.lineTo(secondVertex.x * scale, secondVertex.y * scale);
      });
    }

    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    update();
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }} ref={containerRef}>
        <canvas
          style={{ background: "black" }}
          ref={canvasRef}
          onScroll={scroll}
          onMouseMove={mouseMove}
        ></canvas>
      </div>
    </div>
  );
};

// export class NodesOLD extends React.Component<NodesProps> {
//   private position: { x: number; y: number };
//   private startPosition: { x: number; y: number };
//   private scale: number = 0.5;
//   static contextType = WadContext;

//   constructor(props: NodesProps) {
//     super(props);

//     this.mouseMove = this.mouseMove.bind(this);
//     this.scroll = this.scroll.bind(this);

//     this.position = { x: 700, y: 700 };
//   }

//   scroll(e) {
//     console.info(e);
//   }

//   mouseMove(e) {
//     if (e.buttons === 0) {
//       return;
//     }

//     this.position.x += e.movementX * (1 / this.scale);
//     this.position.y += e.movementY * (1 / this.scale);

//     this.update();
//   }

//   private update() {
//     const { vertexes, linedefs } = this.props;

//     var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
//     var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

//     var start: { x: number; y: number } = {
//       x: vertexes[linedefs[0].getFirst()].x,
//       y: vertexes[linedefs[0].getFirst()].y,
//     };

//     start.x += this.position.x;
//     start.y += this.position.y;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     linedefs.forEach((linedef) => {
//       var firstVertexIndex: number = linedef.getFirst();
//       var secondVertexIndex: number = linedef.getSecond();
//       var firstVertex: Wad.Vertex = vertexes[firstVertexIndex];
//       var secondVertex: Wad.Vertex = vertexes[secondVertexIndex];

//       ctx.beginPath();
//       ctx.strokeStyle =
//         linedef.getFlag() === Wad.LinedefFlag.Secret ? "red" : "white";

//       ctx.moveTo(
//         (start.x - firstVertex.x) * this.scale,
//         (start.y - firstVertex.y) * this.scale
//       );
//       ctx.lineTo(
//         (start.x - secondVertex.x) * this.scale,
//         (start.y - secondVertex.y) * this.scale
//       );

//       ctx.stroke();
//       ctx.closePath();
//     });

//     this.renderNode(this.props.node, ctx, start, this.scale);
//   }

//   private renderNode(
//     node: Wad.Node,
//     ctx: CanvasRenderingContext2D,
//     start: { x: number; y: number },
//     scale: number
//   ) {
//     if (node === null) {
//       return;
//     }

//     // console.info('RENDER NODE', this.props.node);

//     this.renderBounds(ctx, scale, node.getRightBounds(), start, "blue");
//     this.renderBounds(ctx, scale, node.getLeftBounds(), start, "green");

//     let partitionLine: {
//       to: { x: number; y: number };
//       from: { x: number; y: number };
//     } = node.getPartitionLine();

//     this.renderPartitionLine(
//       ctx,
//       scale,
//       partitionLine.from,
//       partitionLine.to,
//       start
//     );
//   }

//   private renderPartitionLine(
//     ctx: CanvasRenderingContext2D,
//     scale: number,
//     from: { x: number; y: number },
//     to: { x: number; y: number },
//     start: { x: number; y: number }
//   ) {
//     ctx.beginPath();
//     ctx.moveTo((start.x - from.x) * scale, (start.y + from.y) * scale);
//     ctx.lineTo((start.x - to.x) * scale, (start.y + to.y) * scale);
//     ctx.strokeStyle = "red";
//     ctx.stroke();
//     ctx.closePath();
//   }

//   private renderBounds(
//     ctx: CanvasRenderingContext2D,
//     scale: number,
//     bounds: { uX: number; uY: number; lX: number; lY: number },
//     start: { x: number; y: number },
//     style: string
//   ) {
//     ctx.beginPath();
//     ctx.moveTo((start.x - bounds.uX) * scale, (start.y + bounds.uY) * scale);
//     ctx.lineTo((start.x - bounds.lX) * scale, (start.y + bounds.uY) * scale);
//     ctx.lineTo((start.x - bounds.lX) * scale, (start.y + bounds.lY) * scale);
//     ctx.lineTo((start.x - bounds.uX) * scale, (start.y + bounds.lY) * scale);
//     ctx.lineTo((start.x - bounds.uX) * scale, (start.y + bounds.uY) * scale);
//     ctx.strokeStyle = style;
//     ctx.stroke();
//     ctx.closePath();
//   }

//   componentWillReceiveProps(nextProps) {
//     this.update();
//   }

//   componentDidMount() {
//     (this.refs.canvas as HTMLCanvasElement).addEventListener(
//       "scroll",
//       this.scroll
//     );
//     this.update();
//     // ctx.scale(0.1, 0.1);
//   }

//   componentWillUnmount() {
//     (this.refs.canvas as HTMLCanvasElement).removeEventListener(
//       "scroll",
//       this.scroll
//     );
//   }

//   render() {
//     return (
//       <div
//         style={{ height: "100vh", display: "flex", flexDirection: "column" }}
//       >
//         <div style={{ flex: 1 }}>
//           <canvas
//             ref="canvas"
//             width={window.innerWidth}
//             height={window.innerHeight / 2}
//             onScroll={this.scroll}
//             onMouseMove={this.mouseMove}
//           />
//         </div>
//       </div>
//     );
//   }
// }
