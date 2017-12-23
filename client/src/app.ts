import * as Engine from 'engine';
import * as Wad from 'wad';

console.info(Wad, Engine.Inputs.LEFT_ARROW);

class App implements Engine.CoreDelegate {
  private canvas: HTMLCanvasElement;
  private builder: Wad.Builder;
  private camera: Engine.Camera;
  private inputManager: Engine.InputManager;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.onLoaded = this.onLoaded.bind(this);

    this.builder = new Wad.Builder();
    this.builder.parser.onLoad = this.onLoaded;

    this.builder.parser.loadFile('.build/assets/doom.wad');
  }

  update() {
    if (Engine.Inputs.LEFT_ARROW.state == Engine.InputState.Pressed){
    	this.camera.rotate(2);
    } else if (Engine.Inputs.RIGHT_ARROW.state == Engine.InputState.Pressed){
    	this.camera.rotate(-2);
    }
    if (Engine.Inputs.UP_ARROW.state == Engine.InputState.Pressed){
    	this.camera.moveForward(5);
    }
  }

  private onLoaded() {
    this.builder.go();

    let wad = this.builder.getWad();
    this.loadMap(wad.getMaps()[0], wad);
  }

  private loadMap(map: Wad.Map, wad: Wad.Wad) {
    let core = new Engine.Core(this.canvas, this);
    this.camera = core.getCamera();
    this.inputManager = core.getInputManager();

    core.createMap(map, wad);

    console.info(Wad);

    let things: Wad.Thing[] = map.getThings().get();
    things.forEach(thing => {
      if (thing.getType() == 'player 1 start') {
        this.setPlayer(thing);
      }
    });
  }

  private setPlayer(thing: Wad.Thing) {
    let position: { x: number; y: number } = thing.getPosition();

    this.camera.position.x = position.x;
    this.camera.position.z = position.y;
    this.camera.position.y = 40;

    // this.camera.lookAt(new THREE.Vector3(this.camera.position.x + 100, this.camera.position.y, this.camera.position.z));

    this.camera.rotate(thing.getAngle());
    console.info(this.camera);
  }
}

(function() {
  new App();
})();
