import * as THREE from "three";

import * as Wad from "wad";

import { Triangulation } from "./triangulation";
import { Delaunay } from "./delaunay/delaunay";

export class Floor extends THREE.Group {
  private mesh: THREE.Mesh;
  private material: THREE.MeshBasicMaterial;
  private geometry: THREE.BufferGeometry;
  private texture: THREE.DataTexture;
  private textures: Wad.Flat[];
  private delaunay: Delaunay;
  private y: number = Number.MIN_VALUE;
  seg: Wad.Seg;

  private generator: Triangulation;
  private indices: number[];

  constructor(textures: Wad.Flat[], invert: Boolean = false) {
    super();

    this.textures = textures;
    // this.generator = new PolygonGeneration();

    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      // wireframe: true,
      // map: this.texture,
      // color: 0xff0000,
    });

    this.material.side = invert ? THREE.FrontSide : THREE.BackSide;
    // this.material.side = THREE.DoubleSide;

    this.material.needsUpdate = true;
    this.geometry = new THREE.BufferGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.add(this.mesh);
  }

  select() {
    // console.info(JSON.stringify(this.vertices));
    this.children.forEach((child) => {
      let mesh = child as THREE.Mesh;
      if (mesh.geometry.type === "BoxGeometry") {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
      }
    });
  }

  setTexture(name: string) {
    let texture: Wad.Flat = this.getTexture(name);

    if (texture == null) {
      console.info(name);
      return;
    }

    const pixelData = [];
    var width = texture.getWidth();
    var height = texture.getHeight();

    var data: Uint8Array = Uint8Array.from(texture.getImageData());
    this.texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.UVMapping,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.NearestFilter,
      THREE.LinearFilter,
      16,
      THREE.LinearEncoding
    );

    var bbox = this.geometry.boundingBox;
    var dX = Math.abs(bbox.max.x - bbox.min.x);
    var dY = Math.abs(bbox.max.y - bbox.min.y);
    var dZ = Math.abs(bbox.max.z - bbox.min.z);

    this.texture.repeat.set(Math.max(dX, dY) / width, dZ / height);

    this.texture.needsUpdate = true;

    const offset = {
      x: bbox.min.x,
      y: bbox.min.z,
    };

    this.texture.offset.x = offset.x / 64;
    this.texture.offset.y = offset.y / 64;

    this.texture.needsUpdate = true;
    (this.mesh.material as THREE.MeshBasicMaterial).map = this.texture;
  }

  private getTexture(name: string): Wad.Flat {
    for (var t = 0; t < this.textures.length; t++) {
      if (this.textures[t].getName() == name) {
        return this.textures[t];
      }
    }

    return null;
  }

  create() {}

  setPoints(points: number[][], y: number, cdt: number[][]) {
    let vertices = [];
    let indices = [];
    let uvs = [];

    points.forEach((point, index) => {
      vertices.push(point[0], y, point[1]);
    });

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );

    this.geometry.computeBoundingBox();

    const bbox = this.geometry.boundingBox;

    cdt.forEach((cdt) => {
      indices.push(cdt[0], cdt[1], cdt[2]);
    });

    points.forEach((temp) => {
      uvs.push(
        (temp[0] - bbox.min.x) / (bbox.max.x - bbox.min.x),
        (temp[1] - bbox.min.z) / (bbox.max.z - bbox.min.z)
      );
    });

    this.geometry.setIndex(indices);
    this.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
  }

  getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }

  getCenter(): { x: number; y: number; z: number } {
    let target = new THREE.Vector3();

    this.geometry.boundingBox.getCenter(target);
    return target;
  }
}
