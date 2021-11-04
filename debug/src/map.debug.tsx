import * as Wad from "wad";
import * as Engine from "engine";
import { RefObject, Component, createRef } from "react";

interface ThingsProps {
  things: Wad.Things;
}

interface MapProps {
  map: Wad.Map;
  wad: Wad.Wad;
}

export class Things extends Component<ThingsProps> {
  render() {
    const { things } = this.props;

    return (
      <div id="infos" style={{ overflow: "auto" }}>
        <ul>
          {things.get().map((thing, index) => (
            <li key={index}>{thing.toString()}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export class Map extends Component<MapProps> {
  private core?: Engine.Core;
  private canvasRef: RefObject<HTMLCanvasElement>;
  private containerRef: RefObject<HTMLDivElement>;

  constructor(props: MapProps) {
    super(props);

    this.canvasRef = createRef();
    this.containerRef = createRef();
    this.resize = this.resize.bind(this);
  }

  private resize() {
    this.canvasRef.current.width = this.containerRef.current.clientWidth;
    this.canvasRef.current.height = this.containerRef.current.clientHeight;
    this.core?.updateCanvas(this.canvasRef.current);
  }

  private rendering() {
    this.resize();
    window.addEventListener("resize", this.resize);

    this.core = new Engine.Core(
      this.canvasRef.current as HTMLCanvasElement,
      null,
      {
        orbitControl: true,
        showFps: true,
      }
    );
    // this.core.setCameraPosition({ x: 10, y: 0, z: 0 });
    this.core.createMap(this.props.map, this.props.wad);

    let things: Wad.Thing[] = this.props.map.getThings().get();
    things.forEach((thing) => {
      if (thing.type.label == "player 1 start") {
        const position: { x: number; y: number } = thing.getPosition();
        this.core.setCameraPosition({ x: position.x, y: 40, z: position.y });
      }
    });
  }

  componentDidMount() {
    this.rendering();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    return (
      <div ref={this.containerRef} style={{ overflow: "hidden" }}>
        <canvas
          ref={this.canvasRef}
          style={{ backgroundColor: "transparent" }}
        />
      </div>
    );
  }
}

// export class Maps {
// 	private maps: Wad.Map[];

// 	constructor(maps: Wad.Map[], container: HTMLElement) {
// 		this.maps = maps;
// 		var self = this;

// 		var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
// 		li.innerHTML = 'MAPS';
// 		li.onclick = () => {
// 			self.setMaps();
// 		};

// 		container.appendChild(li);
// 	}

// 	private setMaps() {
// 		var subtree = document.getElementsByClassName('subtree');

// 		if (subtree.length > 0) {
// 			subtree[0].remove();
// 		}

// 		var ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
// 		ul.className = 'subtree';

// 		this.maps.forEach((item) => {
// 			var li = document.createElement('li');
// 			li.innerHTML = item.getName();
// 			li.onclick = () => {
// 				console.warn(item.getThings());
// 			};
// 			ul.appendChild(li);
// 		});

// 		document.getElementById('treeview').appendChild(ul);
// 	}
// }

// class MapDebug {
// 	constructor() {

// 	}
// }
