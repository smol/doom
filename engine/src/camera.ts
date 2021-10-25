import * as THREE from "three";
import { OrbitControls } from "./orbitcontrols";

export class Camera {
  private canvas: HTMLCanvasElement;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  public get Camera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  // -- USE FOR FPS
  private angle: number; // in radian
  // ---

  // -- USE FOR DEBUGGING
  private raycaster: THREE.Raycaster;
  private scene: THREE.Scene;

  // ---

  constructor(ratio: number, canvas: HTMLCanvasElement, scene: THREE.Scene) {
    this.camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 9000);

    this.scene = scene;

    this.canvas = canvas;
    this.angle = -Math.PI / 2; // -90 degrees

    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;

    this.activeOrbitControl = this.activeOrbitControl.bind(this);

    this.canvas.addEventListener("mousedown", this.onDocumentMouseDown);
  }

  update() {
    this.controls?.update();
  }

  lookAt(target: THREE.Vector3) {
    this.camera.lookAt(target);

    this.controls?.setTarget(target);
    this.controls?.update();
  }

  setPosition(position: THREE.Vector3) {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;

    this.controls?.setPosition(position);
    this.controls?.update();
  }

  rotate(degree: number) {
    this.angle += THREE.MathUtils.degToRad(degree);
    this.camera.rotation.y = this.angle;
  }

  moveForward(speed) {
    let x: number = Math.sin(this.angle) * speed;
    let y: number = Math.cos(this.angle) * speed;

    this.camera.position.add(new THREE.Vector3(-x, 0, -y));
  }

  // -- USE FOR DEBUGGING
  activeOrbitControl(scene: THREE.Scene) {
    this.scene = scene;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.listenToKeyEvents(window);

    // this.lookAt(new THREE.Vector3(0, 0,0 ));
  }

  onDocumentMouseDown(event) {
    event.preventDefault();
    var y: number = event.clientY - this.canvas.getBoundingClientRect().top;

    var mouse3D = new THREE.Vector2(
      (event.clientX / this.canvas.width) * 2 - 1,
      -(y / this.canvas.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse3D, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      intersects.forEach((inter) => {
        let current = inter.object;
        while (current) {
          if ((current as any).toDebug) {
            console.info((current as any).toDebug());
          }
          current = current.parent;
        }
      });
    }
  }
  // ---
}
