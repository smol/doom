import * as THREE from "three";

import * as Wad from "wad";

import { PolygonGeneration } from "./polygonGen";
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

  private generator: PolygonGeneration;
  private indices: number[];

  constructor(textures: Wad.Flat[], invert: Boolean = false) {
    super();

    this.textures = textures;
    this.generator = new PolygonGeneration();

    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      // map: this.texture,
      color: 0xffffff,
    });

    if (invert) this.material.side = THREE.FrontSide;
    else this.material.side = THREE.BackSide;

    this.material.needsUpdate = true;
    this.geometry = new THREE.BufferGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.add(this.mesh);
  }

  private createFaces() {
    // this.geometry.computeBoundingBox();
    // var max = this.geometry.boundingBox.max,
    //   min = this.geometry.boundingBox.min;
    // var offset = new THREE.Vector2(0 - min.x, 0 - min.z);
    // var range = new THREE.Vector2(max.x - min.x, max.z - min.z);
    // var faces = this.geometry.faces;
    // this.geometry.faceVertexUvs[0] = [];
    // for (var i = 0; i < faces.length; i++) {
    //   var v1 = this.geometry.vertices[faces[i].a],
    //     v2 = this.geometry.vertices[faces[i].b],
    //     v3 = this.geometry.vertices[faces[i].c];
    //   this.geometry.faceVertexUvs[0].push([
    //     new THREE.Vector2(
    //       (v1.x + offset.x) / range.x,
    //       (v1.z + offset.y) / range.y
    //     ),
    //     new THREE.Vector2(
    //       (v2.x + offset.x) / range.x,
    //       (v2.z + offset.y) / range.y
    //     ),
    //     new THREE.Vector2(
    //       (v3.x + offset.x) / range.x,
    //       (v3.z + offset.y) / range.y
    //     ),
    //   ]);
    // }
    // this.geometry.uvsNeedUpdate = true;
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

  private repeatedTexture(size: { width: number; height: number }) {
    // let bounding = this.geometry.boundingBox;
    // if (!bounding) return;
    // let scale: number = 1;
    // let width: number = bounding.max.x - bounding.min.x;
    // let height: number = bounding.max.z - bounding.min.z;
    // let offsetX = bounding.min.x / width;
    // let offsetY = bounding.min.z / height;
    // width = width / size.width * scale;
    // height = height / size.height * scale;
    // let result = {
    //   x: width,
    //   y: height,
    //   offsetX: offsetX,
    //   offsetY: offsetY
    // };
    // // console.info('width', width, 'height', height, 'size', size, 'result', result);
    // return result;
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

    function isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }

    let wrapping: THREE.Wrapping = THREE.RepeatWrapping;

    // if (isPowerOf2(width) && isPowerOf2(height))
    // 	wrapping = THREE.RepeatWrapping;

    var data: Uint8Array = Uint8Array.from(texture.getImageData());
    this.texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.UVMapping,
      wrapping,
      wrapping,
      THREE.NearestFilter,
      THREE.LinearFilter,
      16,
      THREE.LinearEncoding
    );

    let repeated: any = this.repeatedTexture({ width: width, height: height });
    if (repeated) {
      this.texture.repeat.set(repeated.x, repeated.y);
      this.texture.offset.set(repeated.offsetX, repeated.offsetY);
    }

    // this.texture.repeat.set(2, 2);
    this.texture.needsUpdate = true;

    // this.material = new THREE.MeshBasicMaterial({
    // 	transparent: true,
    // 	map: this.texture,
    // 	// color: 0xFF0000
    // });

    // this.material.side = THREE.DoubleSide;

    // this.material.needsUpdate = true;
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

  addWall(linedef: Wad.Linedef, height: number, texture: string) {
    this.y = height;
    this.generator.addLinedef(linedef, 0);

    this.setTexture(texture);
  }

  create() {
    // this.geometry.vertices = [];
    // var materialCube: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00
    // });
    // try {
    //   let orderedsegments = this.generator.start();
    //   let supertriangles: poly2tri.Triangle[][] = this.generator.triangles;
    //   if (!supertriangles) return;
    //   supertriangles.forEach(triangles => {
    //     triangles.forEach(triangle => {
    //       triangle.getPoints().forEach(point => {
    //         this.geometry.vertices.push(
    //           new THREE.Vector3(point.x, this.y, point.y)
    //         );
    //       });
    //       this.geometry.faces.push(
    //         new THREE.Face3(
    //           this.geometry.vertices.length - 3,
    //           this.geometry.vertices.length - 2,
    //           this.geometry.vertices.length - 1
    //         )
    //       );
    //     });
    //   });
    //   this.geometry.computeBoundingBox();
    //   var max = this.geometry.boundingBox.max,
    //     min = this.geometry.boundingBox.min;
    //   var offset = new THREE.Vector2(0 - min.x, 0 - min.z);
    //   var range = new THREE.Vector2(max.x - min.x, max.z - min.z);
    //   range.x *= 0.15;
    //   range.y *= 0.15;
    //   this.geometry.faceVertexUvs[0] = [];
    //   for (var i = 0; i < this.geometry.faces.length; i++) {
    //     var v1 = this.geometry.vertices[this.geometry.faces[i].a],
    //       v2 = this.geometry.vertices[this.geometry.faces[i].b],
    //       v3 = this.geometry.vertices[this.geometry.faces[i].c];
    //     this.geometry.faceVertexUvs[0].push([
    //       new THREE.Vector2(
    //         (v1.x + offset.x) / range.x,
    //         (v1.z + offset.y) / range.y
    //       ),
    //       new THREE.Vector2(
    //         (v2.x + offset.x) / range.x,
    //         (v2.z + offset.y) / range.y
    //       ),
    //       new THREE.Vector2(
    //         (v3.x + offset.x) / range.x,
    //         (v3.z + offset.y) / range.y
    //       )
    //     ]);
    //   }
    //   this.geometry.uvsNeedUpdate = true;
    //   this.geometry.computeVertexNormals();
    //   this.geometry.computeFaceNormals();
    //   this.geometry.computeVertexNormals();
    // } catch (e) {
    //   throw {};
    // }
  }
}
