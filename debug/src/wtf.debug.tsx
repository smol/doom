import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Wad from 'wad';
import * as Engine from 'engine';

interface VertexesProps {
  sectors: Wad.Sector[];
}

export namespace Debug {
  class Sector {
    private sector: Wad.Sector;
    private ctx: CanvasRenderingContext2D;
    private segments: Engine.Segment[];

    private strokeColor: string;
    private fillColor: string;

    constructor(sector: Wad.Sector, ctx: CanvasRenderingContext2D) {
      this.sector = sector;
      this.ctx = ctx;

      const red = Math.floor(Math.random() * 255);
      const green = Math.floor(Math.random() * 255);
      const blue = Math.floor(Math.random() * 255);

      this.strokeColor = `rgba(${red},${green},${blue}, 1)`;
      this.fillColor = `rgba(${red},${green},${blue}, 0.2)`;

      let unorderedSegments: Engine.Segment[] = [];
      const what: Engine.PolygonGeneration = new Engine.PolygonGeneration();

      sector.getSidedefs().forEach(sidedef => {
        const linedef = sidedef.getLinedef();

        what.addLinedef(linedef, 2);
      });

      try {
        this.segments = what.start()[0] || [];
      } catch (e) {
        this.segments = [];
      }
    }

    private renderArrow(
      fromx: number,
      fromy: number,
      tox: number,
      toy: number
    ) {
      var headlen = 10; // length of head in pixels
      var angle = Math.atan2(toy - fromy, tox - fromx);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.moveTo(fromx, fromy);
      this.ctx.lineTo(tox, toy);
      this.ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 6),
        toy - headlen * Math.sin(angle - Math.PI / 6)
      );
      this.ctx.moveTo(tox, toy);
      this.ctx.lineTo(
        tox - headlen * Math.cos(angle + Math.PI / 6),
        toy - headlen * Math.sin(angle + Math.PI / 6)
      );
      this.ctx.stroke();
      this.ctx.closePath();
    }

    private renderText(
      text: string,
      from: { x: number; z: number },
      to: { x: number; z: number },
      position: { x: number; y: number },
      scale: number
    ) {
      this.ctx.font = '10px Arial';
      this.ctx.fillStyle = this.strokeColor;
      this.ctx.fillText(
        `${text}`,
        (from.x + (to.x - from.x) / 2 + position.x) * scale,
        (from.z + (to.z - from.z) / 2 + position.y) * scale
      );
    }

    render(position: { x: number; y: number }, scale: number) {
      var start: { x: number; y: number } = {
        x: 0,
        y: 0
      };

      start.x -= position.x;
      start.y -= position.y;

      this.segments.forEach((segment, index) => {
        const begin: { x: number; y: number } = {
          x: -(start.x - segment.start.x) * scale,
          y: -(start.y - segment.start.z) * scale
        };

        const end: { x: number; y: number } = {
          x: -(start.x - segment.end.x) * scale,
          y: -(start.y - segment.end.z) * scale
        };

        this.renderArrow(begin.x, begin.y, end.x, end.y);
        this.renderText(
          `${index}`,
          segment.start,
          segment.end,
          position,
          scale
        );
      });
    }
  }

  export class Wtf extends React.Component<VertexesProps> {
    private position: { x: number; y: number };
    private startPosition: { x: number; y: number };
    private scale: number = 0.5;

    private segments: Engine.Segment[];
    private sectors: Sector[];

    constructor(props: VertexesProps) {
      super(props);
      this.mouseMove = this.mouseMove.bind(this);
      this.mouseDown = this.mouseDown.bind(this);

      this.position = { x: 500, y: 500 };
      this.startPosition = { x: 0, y: 0 };
    }

    mouseMove(e) {
      if (e.buttons === 0) {
        return;
      }

      this.position = {
        x: this.position.x + (e.screenX - this.startPosition.x) * 2,
        y: this.position.y + (e.screenY - this.startPosition.y) * 2
      };

      this.renderProps();

      this.startPosition = { x: e.screenX, y: e.screenY };
    }

    mouseDown(e) {
      this.startPosition = { x: e.screenX, y: e.screenY };
    }

    private parseProps(sectors: Wad.Sector[]) {
      const canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

      this.sectors = [];
      // this.sectors.push(new Sector(sectors[38], ctx));
      sectors.forEach(sector => {
        this.sectors.push(new Sector(sector, ctx));
      });
    }

    private renderProps() {
      const canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.sectors.forEach(sector => {
        sector.render(this.position, this.scale);
      });
    }

    componentWillReceiveProps(nextProps) {
      this.parseProps(nextProps.sectors);
      this.renderProps();
    }

    componentDidMount() {
      this.parseProps(this.props.sectors);
      this.renderProps();
    }

    render() {
      return (
        <canvas
          ref="canvas"
          width={window.innerWidth}
          height={window.innerHeight / (1 / 0.8)}
          onMouseMove={this.mouseMove}
          onMouseDown={this.mouseDown}
        />
      );
    }
  }
}
