export enum InputState {
  Pressed,
  Released
}

export interface Input {
  keyCode: number;
  state: InputState;
}

export class Inputs {
  public static LEFT_ARROW: Input = { keyCode: 37, state: InputState.Released };
  public static UP_ARROW: Input = { keyCode: 38, state: InputState.Released };
  public static RIGHT_ARROW: Input = { keyCode: 39, state: InputState.Released };
  public static DOWN_ARROW: Input = { keyCode: 40, state: InputState.Released };

  static instance() : Inputs{
    return new Inputs;
  }
}

export class InputManager {
  constructor() {
    this.KeyDown = this.KeyDown.bind(this);
    this.KeyUp = this.KeyUp.bind(this);

    document.addEventListener('keydown', this.KeyDown);
    document.addEventListener('keyup', this.KeyUp);
  }

  private KeyUp(event) {
    for (let key in Inputs) {
      if (
        Inputs[key].keyCode === event.which &&
        Inputs[key].state !== InputState.Released
      ) {
        Inputs[key].state = InputState.Released;
      }
    }
  }

  private KeyDown(event) {
    for (let key in Inputs) {
      if (
        Inputs[key].keyCode === event.which &&
        Inputs[key].state !== InputState.Pressed
      ) {
        Inputs[key].state = InputState.Pressed;
      }
    }
  }
}
