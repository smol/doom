import * as THREE from "three";
import * as Wad from "wad";

export class WallSector extends THREE.Group {
  private geometry: THREE.BufferGeometry;
  private mesh: THREE.Mesh;
  private material: THREE.Material;
  private texture: THREE.DataTexture;
  private textureNames: { floor: string; ceiling: string };

  private indices: number[];

  constructor(
    vertices: THREE.Vector3[],
    direction: number,
    textureNames: { floor: string; ceiling: string }
  ) {
    super();

    this.textureNames = textureNames;
    this.indices = [];

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      // map: this.texture,
      // color: 0x002200
    });

    // if (direction === 0)
    // 	this.material.side = THREE.FrontSide;
    // else
    // 	this.material.side = THREE.BackSide;
    this.material.side = THREE.DoubleSide;

    this.material.needsUpdate = true;
    const floatVertices = [];

    vertices.forEach((vertex) => {
      floatVertices.push(vertex.x, vertex.y, vertex.z);
    });

    this.indices = [0, 1, 2, 0, 2, 3];

    this.geometry.setIndex(this.indices);
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(floatVertices), 3)
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.add(this.mesh);
  }

  private mapTexture(textureSize: { width: number; height: number }) {
    this.geometry.computeBoundingBox();

    this.indices = [];
    // this.geometry.faceVertexUvs[0] = [];

    var max = this.geometry.boundingBox.max,
      min = this.geometry.boundingBox.min;

    let min2d = new THREE.Vector2(min.x, min.z);
    let max2d = new THREE.Vector2(max.x, max.z);

    // distance between min and zero;
    let minDistance: number = min2d.distanceTo(new THREE.Vector2(0, 0));
    let length: number = max2d.distanceTo(min2d);

    var offset = new THREE.Vector2(-minDistance, -min.y);
    let height = max.y - min.y;
    const refHeight = 72;
    var scale = new THREE.Vector2(
      length / (length / 72),
      height / (height / refHeight)
    );

    // this.geometry.faceVertexUvs[0] = [];
    const positions = this.geometry.getAttribute("position").array;
    const uvAttribute = this.geometry.getAttribute("uv");

    for (let i = 0; i < this.indices.length; i += 3) {
      const v1 = [
          positions[this.indices[i + 0] + 0],
          positions[this.indices[i + 0] + 1],
          positions[this.indices[i + 0] + 2],
        ],
        v2 = [
          positions[this.indices[i + 1] + 0],
          positions[this.indices[i + 1] + 1],
          positions[this.indices[i + 1] + 2],
        ],
        v3 = [
          positions[this.indices[i + 2] + 0],
          positions[this.indices[i + 2] + 1],
          positions[this.indices[i + 2] + 2],
        ];

      let v1x: number = new THREE.Vector2(v1[0], v1[2]).distanceTo(min2d);
      let v2x: number = new THREE.Vector2(v2[0], v2[2]).distanceTo(min2d);
      let v3x: number = new THREE.Vector2(v3[0], v3[2]).distanceTo(min2d);

      let v1y: number = v1[1] + offset.y;
      let v2y: number = v2[1] + offset.y;
      let v3y: number = v3[1] + offset.y;

      uvAttribute.setXY(i + 0, v1x / scale.x, v1y / scale.y);
      uvAttribute.setXY(i + 1, v2x / scale.x, v2y / scale.y);
      uvAttribute.setXY(i + 2, v3x / scale.x, v3y / scale.y);
    }

    // for (var i = 0; i < this.geometry.faces.length; i++) {
    //   var v1 = this.geometry.vertices[this.geometry.faces[i].a],
    //     v2 = this.geometry.vertices[this.geometry.faces[i].b],
    //     v3 = this.geometry.vertices[this.geometry.faces[i].c];

    //   let v1x: number = new THREE.Vector2(v1.x, v1.z).distanceTo(min2d);
    //   let v2x: number = new THREE.Vector2(v2.x, v2.z).distanceTo(min2d);
    //   let v3x: number = new THREE.Vector2(v3.x, v3.z).distanceTo(min2d);

    //   let v1y: number = v1.y + offset.y;
    //   let v2y: number = v2.y + offset.y;
    //   let v3y: number = v3.y + offset.y;

    //   this.geometry.faceVertexUvs[0].push([
    //     new THREE.Vector2(v1x / scale.x, v1y / scale.y),
    //     new THREE.Vector2(v2x / scale.x, v2y / scale.y),
    //     new THREE.Vector2(v3x / scale.x, v3y / scale.y),
    //   ]);
    // }

    // this.geometry.uvsNeedUpdate = true;
  }

  private repeatedTexture(size: { width: number; height: number }) {
    let bounding = this.geometry.boundingBox;

    let z: number = bounding.max.z - bounding.min.z;
    let x: number = bounding.max.x - bounding.min.x;

    let scale: number = 1;
    let width: number = Math.sqrt(x * x + z * z);
    let height: number = bounding.max.y - bounding.min.y;
    let result = {
      x: (width / size.width) * scale,
      y: (height / size.height) * scale,
    };
    // console.info('width', width, 'height', height, 'size', size, 'result', result);
    return result;
  }

  setTexture(texture: Wad.Graphic, offset: { x: number; y: number }) {
    if (texture == null) {
      return;
    }
    // console.info(texture.getName(), texture.getWidth(), texture.getHeight());

    const pixelData = [];
    var width = texture.getWidth();
    var height = texture.getHeight();

    function isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }

    let wrapping: THREE.Wrapping = THREE.ClampToEdgeWrapping;

    if (isPowerOf2(width) && isPowerOf2(height))
      wrapping = THREE.RepeatWrapping;

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
      THREE.NearestFilter,
      16,
      THREE.LinearEncoding
    );

    this.mapTexture({ width: width, height: height });

    this.texture.needsUpdate = true;
    (this.mesh.material as THREE.MeshBasicMaterial).map = this.texture;
  }

  getFloorTexture(): string {
    return this.textureNames.floor;
  }

  getCeilingTexture(): string {
    return this.textureNames.ceiling;
  }

  getVertexes(): THREE.Vector3[] {
    // return this.geometry.vertices;
    return [];
  }
}

export class Wall extends THREE.Group {
  private textures: Wad.Textures[];
  private lowerSector: WallSector;
  private upperSector: WallSector;
  private middleSector: WallSector;

  constructor(textures: Wad.Textures[]) {
    super();
    this.textures = textures;
  }

  setVertexes(
    firstVertex: THREE.Vector2,
    secondVertex: THREE.Vector2,
    rightSidedef: Wad.Sidedef,
    leftSidedef: Wad.Sidedef,
    seg: Wad.Seg
  ) {
    let rightSector: Wad.Sector = rightSidedef.getSector();

    if (leftSidedef) {
      let leftSector: Wad.Sector = leftSidedef.getSector();
      let upperFloorHeight = leftSidedef.getSector().getCeilingHeight();
      let upperCeilingHeight = rightSidedef.getSector().getCeilingHeight();
      let lowerFloorHeight = rightSidedef.getSector().getFloorHeight();
      let lowerCeilingHeight = leftSidedef.getSector().getFloorHeight();

      this.lowerSector = new WallSector(
        [
          new THREE.Vector3(firstVertex.x, lowerFloorHeight, firstVertex.y),
          new THREE.Vector3(firstVertex.x, lowerCeilingHeight, firstVertex.y),
          new THREE.Vector3(secondVertex.x, lowerCeilingHeight, secondVertex.y),
          new THREE.Vector3(secondVertex.x, lowerFloorHeight, secondVertex.y),
        ],
        seg.getDirection(),
        {
          floor: rightSector.getFloorTextureName(),
          ceiling: leftSector.getCeilingTextureName(),
        }
      );

      this.add(this.lowerSector);

      this.lowerSector.setTexture(
        this.getTexture(rightSidedef.getLower()),
        rightSidedef.getPosition()
      );

      this.upperSector = new WallSector(
        [
          new THREE.Vector3(firstVertex.x, upperFloorHeight, firstVertex.y),
          new THREE.Vector3(firstVertex.x, upperCeilingHeight, firstVertex.y),
          new THREE.Vector3(secondVertex.x, upperCeilingHeight, secondVertex.y),
          new THREE.Vector3(secondVertex.x, upperFloorHeight, secondVertex.y),
        ],
        seg.getDirection(),
        {
          floor: leftSector.getFloorTextureName(),
          ceiling: rightSector.getCeilingTextureName(),
        }
      );

      this.add(this.upperSector);

      this.upperSector.setTexture(
        this.getTexture(rightSidedef.getUpper()),
        rightSidedef.getPosition()
      );
    } else {
      let ceilingHeight = rightSidedef.getSector().getCeilingHeight();
      let floorHeight = rightSidedef.getSector().getFloorHeight();

      this.middleSector = new WallSector(
        [
          new THREE.Vector3(firstVertex.x, floorHeight, firstVertex.y),
          new THREE.Vector3(firstVertex.x, ceilingHeight, firstVertex.y),
          new THREE.Vector3(secondVertex.x, ceilingHeight, secondVertex.y),
          new THREE.Vector3(secondVertex.x, floorHeight, secondVertex.y),
        ],
        seg.getDirection(),
        {
          floor: rightSector.getFloorTextureName(),
          ceiling: rightSector.getCeilingTextureName(),
        }
      );

      this.add(this.middleSector);

      this.middleSector.setTexture(
        this.getTexture(rightSidedef.getMiddle()),
        rightSidedef.getPosition()
      );
    }
  }

  private getTexture(name: string): Wad.Graphic {
    // console.info(name);
    for (var t = 0; t < this.textures.length; t++) {
      let textures: Wad.Texture[] = this.textures[t].getTextures();
      for (var t2 = 0; t2 < textures.length; t2++) {
        if (textures[t2].getName() == name) {
          return textures[t2].getPatches()[0].pname.getGraphics();
        }
      }
    }

    return null;
  }

  getFloorTexture(): string {
    if (this.lowerSector) return this.lowerSector.getFloorTexture();
    return this.middleSector.getFloorTexture();
  }

  getCeilingTexture(): string {
    if (this.upperSector) return this.upperSector.getCeilingTexture();
    return this.middleSector.getCeilingTexture();
  }

  getUpperVertexes(): THREE.Vector3[] {
    if (this.upperSector) return this.upperSector.getVertexes();
    return [];
  }

  getLowerSector(): WallSector {
    if (this.lowerSector) return this.lowerSector;
    return null;
  }

  getMiddleSector(): WallSector {
    if (this.middleSector) return this.middleSector;
    return null;
  }
}
