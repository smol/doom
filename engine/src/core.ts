import * as THREE from "three";
import * as Wad from "wad";

import { Camera } from "./camera";
import { InputManager } from "./input";
import { Subsector } from "./subsector";
import { Sector } from "./sector";
import { Wall } from "./wall";
import { Thing } from "./thing";

let subsector: Subsector;
let sector: Sector;

export interface Config {
  showFps: boolean;
  orbitControl: boolean;
}

export interface CoreDelegate {
  update: () => void;
}

export class Core {
  private config: Config;
  private _scene: THREE.Scene;
  private camera: Camera;
  private textures: Wad.Textures[];
  private flats: Wad.Flat[];
  private delegate?: CoreDelegate;
  private isRunning: boolean;

  private inputManager: InputManager;

  private renderer: THREE.WebGLRenderer;

  public get scene(): THREE.Scene {
    return this._scene;
  }

  constructor(
    canvas: HTMLCanvasElement,
    delegate: CoreDelegate,
    config: Config = { orbitControl: false, showFps: false }
  ) {
    this.isRunning = true;
    this.delegate = delegate;
    this.config = config;

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(canvas.width, canvas.height);

    this.initScene(canvas);

    this.camera = new Camera(canvas.width / canvas.height, canvas, this._scene);
    if (!config.orbitControl) {
      this.inputManager = new InputManager();
    } else {
      this.camera.activeOrbitControl(this._scene);
    }

    this.render = this.render.bind(this);

    var fps = 24;
    var interval = 1000 / fps;

    const draw = () => {
      if (!this.isRunning) {
        return;
      }

      setTimeout(() => {
        requestAnimationFrame(draw);
        this.render();
      }, interval);
    };

    // const draw = () => {
    //   this.render();
    //   requestAnimationFrame(draw);
    // };
    draw();
  }

  updateCanvas(canvas: HTMLCanvasElement) {
    this.camera.Camera.aspect = canvas.width / canvas.height;
    this.camera.Camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.width, canvas.height);
  }

  getCamera(): Camera {
    return this.camera;
  }

  getInputManager(): InputManager {
    return this.inputManager;
  }

  stop() {
    this.isRunning = false;
  }

  getType(): { subsector: Subsector; sector: Sector }[] {
    return null;
  }

  private render() {
    if (this.delegate) this.delegate.update();

    this.camera.update();
    this.renderer.render(this._scene, this.camera.Camera);
  }

  private initScene(canvas: HTMLCanvasElement) {
    this._scene = new THREE.Scene();

    let axis = new THREE.AxesHelper(10);

    this._scene.add(axis);

    // add lights
    let light = new THREE.DirectionalLight(0xffffff, 1.0);

    light.position.set(100, 100, 100);

    this._scene.add(light);

    let light2 = new THREE.DirectionalLight(0xffffff, 1.0);

    light2.position.set(-100, 100, -100);

    this._scene.add(light2);
  }

  private node(node: Wad.Node) {
    if (node === null) return;

    this.subsector(node.getRightSubsector(), node.getRightBounds());
    this.subsector(node.getLeftSubsector(), node.getLeftBounds());

    this.node(node.getLeftNode());
    this.node(node.getRightNode());
  }

  private subsector(
    subsector: Wad.Subsector,
    bounds: { uX: number; uY: number; lX: number; lY: number }
  ) {
    if (subsector !== null) {
      let sector = new Subsector(subsector, this.textures, this.flats, bounds);

      this._scene.add(sector);
    }
  }

  setCameraPosition(position: { x: number; y: number; z: number }) {
    this.camera.setPosition(
      new THREE.Vector3(position.x, position.y, position.z)
    );
    // this.camera.Camera.lookAt(
    //   new THREE.Vector3(position.x + 100, position.y + 100, position.z + 100)
    // );
  }

  lookAt(target: { x: number; y: number; z: number }) {
    this.camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
  }

  createWalls(linedefs: Wad.Linedef[]) {
    linedefs.forEach((linedef) => {
      let rightSidedef: Wad.Sidedef = linedef.getRightSidedef();
      let leftSidedef: Wad.Sidedef = linedef.getLeftSidedef();

      let startVertex: THREE.Vector2 = new THREE.Vector2(
        linedef.getFirstVertex().x,
        linedef.getFirstVertex().y
      );
      let endVertex: THREE.Vector2 = new THREE.Vector2(
        linedef.getSecondVertex().x,
        linedef.getSecondVertex().y
      );

      let wall = new Wall(this.textures);
      wall.setVertexes(
        startVertex,
        endVertex,
        rightSidedef,
        leftSidedef,
        linedef
      );

      this._scene.add(wall);
      // this.walls.push(wall);
    });
  }

  setTextures(textures: Wad.Textures[]) {
    this.textures = textures;
  }

  createMap(map: Wad.Map, wad: Wad.Wad) {
    this.textures = wad.getTextures();
    this.flats = wad.getFlats();
    const graphics = wad.getGraphics();
    const things = map.getThings();

    // this.node(map.getNode());

    this.createWalls(map.getLinedefs());

    map.getSectors().forEach((item) => {
      let sector = new Sector(item, this.flats, things, graphics);

      this._scene.add(sector);
    });

    // map
    //   .getThings()
    //   .get()
    //   .forEach((thing) => {
    //     const temp = new Thing(thing, graphics);
    //     this._scene.add(temp);
    //   });

    console.info("MAP CREATED");
  }
}
