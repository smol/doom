import * as React from "react";

import * as Wad from "wad";
import { WadContext } from "./contextes";

interface NodesProps {
  // node: Wad.Node;
  // linedefs: Wad.Linedef[];
  // vertexes: Wad.Vertex[];
}

export class Node extends React.Component<NodesProps> {
  constructor(props: NodesProps) {
    super(props);
  }
}

export class Nodes extends React.Component<NodesProps> {
  private position: { x: number; y: number };
  private startPosition: { x: number; y: number };
  private scale: number = 0.5;
  static contextType = WadContext;

  constructor(props: NodesProps) {
    super(props);

    this.mouseMove = this.mouseMove.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.scroll = this.scroll.bind(this);

    this.position = { x: 700, y: 700 };
    this.startPosition = { x: 0, y: 0 };
  }

  scroll(e) {
    console.info(e);
  }

  mouseMove(e) {
    if (e.buttons === 0) {
      return;
    }

    this.position = {
      x:
        this.position.x + (e.screenX - this.startPosition.x) * (1 / this.scale),
      y:
        this.position.y + (e.screenY - this.startPosition.y) * (1 / this.scale),
    };

    this.update();

    this.startPosition = { x: e.screenX, y: e.screenY };
  }

  mouseDown(e) {
    this.startPosition = { x: e.screenX, y: e.screenY };
  }

  private update() {
    console.info(this.context);

    var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
    var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    ctx.beginPath();

    // var start: { x: number; y: number } = {
    //   x: this.props.vertexes[this.props.linedefs[0].getFirst()].x,
    //   y: this.props.vertexes[this.props.linedefs[0].getFirst()].y,
    // };

    // start.x += this.position.x;
    // start.y += this.position.y;

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // for (var i = 0; i < this.props.linedefs.length; i++) {
    //   var firstVertexIndex: number = this.props.linedefs[i].getFirst();
    //   var secondVertexIndex: number = this.props.linedefs[i].getSecond();
    //   var firstVertex: Wad.Vertex = this.props.vertexes[firstVertexIndex];
    //   var secondVertex: Wad.Vertex = this.props.vertexes[secondVertexIndex];

    //   ctx.beginPath();
    //   if (this.props.linedefs[i].getFlag() === "Secret") {
    //     ctx.strokeStyle = "red";
    //   } else {
    //     ctx.strokeStyle = "white";
    //   }

    //   ctx.moveTo(
    //     (start.x - firstVertex.x) * this.scale,
    //     (start.y - firstVertex.y) * this.scale
    //   );
    //   ctx.lineTo(
    //     (start.x - secondVertex.x) * this.scale,
    //     (start.y - secondVertex.y) * this.scale
    //   );

    //   ctx.stroke();
    //   ctx.closePath();
    // }

    // this.renderNode(this.props.node, ctx, start, this.scale);
  }

  private renderNode(
    node: Wad.Node,
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    scale: number
  ) {
    if (node === null) {
      return;
    }

    // console.info('RENDER NODE', this.props.node);

    this.renderBounds(ctx, scale, node.getRightBounds(), start, "blue");
    this.renderBounds(ctx, scale, node.getLeftBounds(), start, "green");

    let partitionLine: {
      to: { x: number; y: number };
      from: { x: number; y: number };
    } = node.getPartitionLine();

    this.renderPartitionLine(
      ctx,
      scale,
      partitionLine.from,
      partitionLine.to,
      start
    );
  }

  private renderPartitionLine(
    ctx: CanvasRenderingContext2D,
    scale: number,
    from: { x: number; y: number },
    to: { x: number; y: number },
    start: { x: number; y: number }
  ) {
    ctx.beginPath();
    ctx.moveTo((start.x - from.x) * scale, (start.y + from.y) * scale);
    ctx.lineTo((start.x - to.x) * scale, (start.y + to.y) * scale);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  }

  private renderBounds(
    ctx: CanvasRenderingContext2D,
    scale: number,
    bounds: { uX: number; uY: number; lX: number; lY: number },
    start: { x: number; y: number },
    style: string
  ) {
    ctx.beginPath();
    ctx.moveTo((start.x - bounds.uX) * scale, (start.y + bounds.uY) * scale);
    ctx.lineTo((start.x - bounds.lX) * scale, (start.y + bounds.uY) * scale);
    ctx.lineTo((start.x - bounds.lX) * scale, (start.y + bounds.lY) * scale);
    ctx.lineTo((start.x - bounds.uX) * scale, (start.y + bounds.lY) * scale);
    ctx.lineTo((start.x - bounds.uX) * scale, (start.y + bounds.uY) * scale);
    ctx.strokeStyle = style;
    ctx.stroke();
    ctx.closePath();
  }

  componentWillReceiveProps(nextProps) {
    this.update();
  }

  componentDidMount() {
    (this.refs.canvas as HTMLCanvasElement).addEventListener(
      "scroll",
      this.scroll
    );
    this.update();
    // ctx.scale(0.1, 0.1);
  }

  componentWillUnmount() {
    (this.refs.canvas as HTMLCanvasElement).removeEventListener(
      "scroll",
      this.scroll
    );
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width={window.innerWidth}
        height={window.innerHeight / 2}
        onScroll={this.scroll}
        onMouseMove={this.mouseMove}
        onMouseDown={this.mouseDown}
      />
    );
  }
}
