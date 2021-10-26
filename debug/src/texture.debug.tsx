import * as Wad from "wad";
import { Component, createRef, RefObject } from "react";
import { Graphic } from "./graphic.debug";

interface TextureProps {
  texture: Wad.Texture;
  colormaps: Wad.ColorMap;
}

export class Texture extends Component<TextureProps, { base64: string }> {
  private canvasRef: RefObject<HTMLCanvasElement>;
  private containerRef: RefObject<HTMLDivElement>;

  constructor(props: TextureProps) {
    super(props);

    this.state = {
      base64: "",
    };

    this.canvasRef = createRef();
    this.containerRef = createRef();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);

    console.info(this.props.texture);
    this.updateCanvas(this.props.texture);
    setTimeout(this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize() {
    const { clientWidth, clientHeight } = this.containerRef.current;
    // this.canvasRef.current.width = clientWidth;
    // this.canvasRef.current.height = 720;
  }

  private updateCanvas(texture: Wad.Texture) {
    const canvas = this.canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // var canvas: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
    // canvas.height = texture.getHeight();
    // canvas.width = texture.getWidth();

    setTimeout(() => {
      const { width, height, data } = texture.getImageData();

      const graphic = texture.getPatches()[0].pname.getGraphics();
      const temp = graphic.getImageData();

      const oldWidth = graphic.getWidth() * 4;
      const oldHeight = graphic.getHeight();

      canvas.width = width;
      canvas.height = height;
      const log = [];

      // for (let i = 0; i < temp.length; i++) {
      //   const oldX = Math.floor(i % oldWidth) + 0 * 4;
      //   const oldY = Math.floor(i / oldWidth) + 72 * 4;
      //   const newI = oldX + width * 4 * oldY;

      //   log.push(`i: ${i}, oldX: ${oldX}, oldY: ${oldY}, newI: ${newI}`);
      // }

      // console.info(log);

      console.info(width, height, data, temp);
      var idata: ImageData = ctx.createImageData(width, height);
      idata.data.set(data);

      ctx.scale(1, 1);
      createImageBitmap(idata).then((renderer) => {
        ctx.drawImage(renderer, 0, 0, width, height);
        this.setState({ base64: canvas.toDataURL() });
        // ctx.drawImage(renderer, 0, 0, canvas.width, canvas.height);
      });
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    this.updateCanvas(nextProps.flat);
  }

  render() {
    const { texture } = this.props;
    const { base64 } = this.state;

    return (
      <div
        style={{
          padding: 10,
          color: "white",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h4>PATCHES</h4>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {texture.getPatches().map(({ pname, x, y }, index) => {
            const graphic = pname.getGraphics();

            return (
              <div
                key={`patch-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  offset : {x} | {y}
                  <br />
                  width : {graphic.getWidth()} | {graphic.getHeight()}
                  <br />
                </div>
                <Graphic graphic={graphic} style={{ marginLeft: 20 }} />
              </div>
            );
          })}
        </div>

        <ul>
          <li>Name: {texture.getName()}</li>
          <li>Width: {texture.getWidth()}</li>
          <li>Height: {texture.getHeight()}</li>
        </ul>

        <div ref={this.containerRef}>
          <canvas
            ref={this.canvasRef}
            style={{
              background: "blue",
              imageRendering: "crisp-edges",
            }}
            width={800}
            height={580}
          ></canvas>
          <span>{base64}</span>
        </div>
      </div>
    );
  }
}
