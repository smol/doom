import * as THREE from "three";
import * as Wad from "wad";

export class Thing extends THREE.Group {
  constructor(thing: Wad.Thing, graphics: Wad.Graphic[]) {
    super();

    // console.info(thing);
    if (thing.type.sprite === "-" || thing.type.sequence === "-") {
      return;
    }

    const images: Wad.Graphic[] = [];
    const sequence = thing.type.sequence.toUpperCase();
    for (let i = 0; i < sequence.length; i++) {
      const element = sequence[i];

      graphics.forEach((graphic) => {
        if (graphic.getName() === `${thing.type.sprite}${element}0`) {
          images.push(graphic);
        }
      });
    }

    if (images.length === 0) {
      return;
    }

    const data = images[0].getImageData();
    const width = images[0].getWidth();
    const height = images[0].getHeight();

    const texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.UVMapping,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter,
      16,
      THREE.LinearEncoding
    );

    texture.flipY = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });

    const billboard = new THREE.Sprite(material);

    billboard.position.x = 0;
    billboard.position.y = 0;
    billboard.position.z = 0;

    this.add(billboard);

    const { x, y, z } = thing.getPosition();

    const ratio = height / width;
    const size = 20;

    this.position.x = x;
    this.position.y = y + (ratio * size) / 2;
    this.position.z = z;

    const labelBaseScale = 1;
    billboard.scale.x = size;
    billboard.scale.y = ratio * size;
  }
}
