import * as THREE from 'three';
import * as Wad from 'wad';


import { Camera } from './camera';
import { InputManager } from './input';
import { Subsector } from './subsector';
import { Sector } from './sector';

export interface Config {
  showFps: boolean;
  orbitControl: boolean;
}

export interface CoreDelegate {
  update: () => void;
}

export class Core {
  private config: Config;
  private scene: THREE.Scene;
  private camera: Camera;
  private textures: Wad.Textures[];
  private flats: Wad.Flat[];
  private delegate: CoreDelegate;

  private inputManager: InputManager;

  private renderer: THREE.WebGLRenderer;

  constructor(
    canvas: HTMLCanvasElement,
    delegate: CoreDelegate,
    config: Config = { orbitControl: false, showFps: false }
  ) {
    this.delegate = delegate;
    this.config = config;

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });

    this.initScene(canvas);

    this.camera = new Camera(canvas.width / canvas.height, canvas, this.scene);
    if (!config.orbitControl) {
      this.inputManager = new InputManager();
    }

    this.render = this.render.bind(this);

    var self = this;
    function animate(): void {
      requestAnimationFrame(animate);
      self.render();
    }

    animate();
  }

  getCamera(): Camera {
    return this.camera;
  }

  private render() {
    if (this.delegate) this.delegate.update();

    this.renderer.render(this.scene, this.camera);
  }

  private initScene(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();

    let axis = new THREE.AxisHelper(10);

    this.scene.add(axis);

    // add lights
    let light = new THREE.DirectionalLight(0xffffff, 1.0);

    light.position.set(100, 100, 100);

    this.scene.add(light);

    let light2 = new THREE.DirectionalLight(0xffffff, 1.0);

    light2.position.set(-100, 100, -100);

    this.scene.add(light2);
  }

  private node(level: number, node: Wad.Node) {
    if (node === null) return;

    this.subsector(node.getRightSubsector(), node.getRightBounds());
    this.subsector(node.getLeftSubsector(), node.getLeftBounds());

    this.node(level + 1, node.getLeftNode());
    this.node(level + 1, node.getRightNode());
  }

  private subsector(
    subsector: Wad.Subsector,
    bounds: { uX: number; uY: number; lX: number; lY: number }
  ) {
    if (subsector !== null) {
      let sector = new Subsector(subsector, this.textures, this.flats, bounds);

      this.scene.add(sector);
    }
  }

  setCameraPosition(position: { x: number; y: number; z: number }) {
    if (this.config.orbitControl) {
      this.camera.activeOrbitControl(
        this.scene,
        new THREE.Vector3(position.x, position.y, position.z)
      );
    }

    // this.camera.lookAt(new THREE.Vector3(position.x + 100, position.y + 100, position.z + 100));
  }

  createMap(map: Wad.Map, wad: Wad.Wad) {
    this.textures = wad.getTextures();
    this.flats = wad.getFlats();

    this.node(0, map.getNode());

    map.getSectors().forEach(item => {
      let sector = new Sector(item, this.flats);

      this.scene.add(sector);
    });
  }
}
