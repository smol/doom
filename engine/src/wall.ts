import * as THREE from "three";
import * as Wad from "wad";
import { TexturePatch } from "wad/lumps/texture";

export class WallSector extends THREE.Group {
  private geometry: THREE.BufferGeometry;
  private mesh: THREE.Mesh;
  private material: THREE.Material;
  private texture: THREE.DataTexture;
  private textureNames: { floor: string; ceiling: string };
  private sector: Wad.Sector;
  private indices: number[];
  private isUpper: boolean;

  constructor(
    vertices: THREE.Vector3[],
    textureNames: { floor: string; ceiling: string },
    sector: Wad.Sector,
    isUpper: boolean = false
  ) {
    super();

    this.isUpper = isUpper;
    this.sector = sector;

    this.textureNames = textureNames;
    this.indices = [];

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      // vertexColors: true,
      // color: 0xff0000,
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

    // console.info({ vertices });

    this.indices = [0, 2, 1, 0, 3, 2];

    this.geometry.setIndex(this.indices);
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(floatVertices), 3)
    );

    const uvs = [0, 0, 0, 1, 1, 1, 1, 0];

    this.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // const wireframe = new THREE.WireframeGeometry(this.geometry);

    // const line = new THREE.LineSegments(wireframe);
    // line.material.depthTest = false;
    // line.material.opacity = 0.25;
    // line.material.transparent = true;

    // this.add(line);

    this.add(this.mesh);
  }

  setTexture(
    texture: Wad.Texture,
    offset: { x: number; y: number },
    linedefFlag: Wad.LinedefFlag
  ) {
    this.geometry.computeBoundingBox();
    if (!texture) {
      return;
    }

    const { data, width, height, x, y } = texture.getImageData();

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
      THREE.NearestFilter,
      16,
      THREE.LinearEncoding
    );

    var bbox = this.geometry.boundingBox;
    var dX = Math.abs(bbox.max.x - bbox.min.x);
    var dY = Math.abs(bbox.max.y - bbox.min.y);
    var dZ = Math.abs(bbox.max.z - bbox.min.z);

    const repeatX = Math.max(dX, dZ) / width;
    const repeatY = -dY / height;

    this.texture.repeat.set(repeatX, repeatY);

    // this.texture.offset.x = (offset.x - x) / width;
    // this.texture.offset.y = (offset.y - y) / height;
    // if (this.isUpper) {
    //   this.texture.offset.y = x / width;
    //   this.texture.offset.x = y / height;
    // }

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
  private lowerTexture: Wad.Texture;
  private upperTexture: Wad.Texture;
  private middleTexture: Wad.Texture;
  private rightSidedef: Wad.Sidedef;
  private leftSidedef: Wad.Sidedef;
  private linedef: Wad.Linedef;

  constructor(textures: Wad.Textures[]) {
    super();
    this.textures = textures;
  }

  toDebug() {
    const {
      lowerTexture,
      upperTexture,
      middleTexture,
      rightSidedef,
      leftSidedef,
      linedef,
    } = this;
    return {
      linedef,
      lowerTexture,
      upperTexture,
      middleTexture,
      rightSidedef,
      leftSidedef,
    };
  }

  setVertexes(
    firstVertex: THREE.Vector2,
    secondVertex: THREE.Vector2,
    rightSidedef: Wad.Sidedef,
    leftSidedef: Wad.Sidedef,
    linedef: Wad.Linedef
  ) {
    this.linedef = linedef;
    this.rightSidedef = rightSidedef;
    this.leftSidedef = leftSidedef;
    let rightSector: Wad.Sector = rightSidedef.getSector();

    if (leftSidedef) {
      let leftSector: Wad.Sector = leftSidedef.getSector();
      let upperFloorHeight = leftSector.getCeilingHeight();
      let upperCeilingHeight = rightSector.getCeilingHeight();
      let lowerFloorHeight = rightSector.getFloorHeight();
      let lowerCeilingHeight = leftSector.getFloorHeight();

      if (rightSidedef.getLower() !== "-") {
        this.lowerSector = new WallSector(
          [
            new THREE.Vector3(firstVertex.x, lowerFloorHeight, firstVertex.y),
            new THREE.Vector3(firstVertex.x, lowerCeilingHeight, firstVertex.y),
            new THREE.Vector3(
              secondVertex.x,
              lowerCeilingHeight,
              secondVertex.y
            ),
            new THREE.Vector3(secondVertex.x, lowerFloorHeight, secondVertex.y),
          ],
          {
            floor: rightSector.getFloorTextureName(),
            ceiling: leftSector.getCeilingTextureName(),
          },
          leftSector
        );

        this.add(this.lowerSector);

        this.lowerTexture = this.getTexture(rightSidedef.getLower());

        this.lowerSector.setTexture(
          this.lowerTexture,
          rightSidedef.getPosition(),
          linedef.getFlag()
        );
      }

      if (rightSidedef.getUpper() !== "-" || leftSidedef.getUpper() !== "-") {
        this.upperSector = new WallSector(
          [
            new THREE.Vector3(firstVertex.x, upperFloorHeight, firstVertex.y),
            new THREE.Vector3(firstVertex.x, upperCeilingHeight, firstVertex.y),
            new THREE.Vector3(
              secondVertex.x,
              upperCeilingHeight,
              secondVertex.y
            ),
            new THREE.Vector3(secondVertex.x, upperFloorHeight, secondVertex.y),
          ],
          {
            floor: leftSector.getFloorTextureName(),
            ceiling: rightSector.getCeilingTextureName(),
          },
          rightSector,
          true
        );

        this.add(this.upperSector);

        if (rightSidedef.getUpper() !== "-") {
          this.upperTexture = this.getTexture(rightSidedef.getUpper());
        } else {
          this.upperTexture = this.getTexture(leftSidedef.getUpper());
        }

        this.upperSector.setTexture(
          this.upperTexture,
          rightSidedef.getPosition(),
          linedef.getFlag()
        );
      }
    }

    if (rightSidedef.getMiddle() !== "-") {
      let ceilingHeight = rightSector.getCeilingHeight();
      let floorHeight = rightSector.getFloorHeight();

      this.middleSector = new WallSector(
        [
          new THREE.Vector3(firstVertex.x, floorHeight, firstVertex.y),
          new THREE.Vector3(firstVertex.x, ceilingHeight, firstVertex.y),
          new THREE.Vector3(secondVertex.x, ceilingHeight, secondVertex.y),
          new THREE.Vector3(secondVertex.x, floorHeight, secondVertex.y),
        ],
        {
          floor: rightSector.getFloorTextureName(),
          ceiling: rightSector.getCeilingTextureName(),
        },
        rightSector
      );

      this.add(this.middleSector);

      this.middleTexture = this.getTexture(rightSidedef.getMiddle());

      this.middleSector.setTexture(
        this.middleTexture,
        rightSidedef.getPosition(),
        linedef.getFlag()
      );
    }
  }

  private getTexture(name: string): Wad.Texture {
    // console.info(name);
    for (var t = 0; t < this.textures.length; t++) {
      let textures: Wad.Texture[] = this.textures[t].getTextures();
      for (var t2 = 0; t2 < textures.length; t2++) {
        if (textures[t2].getName() == name) {
          return textures[t2];
        }
      }
    }

    return null;
  }

  getLinedef(): Wad.Linedef {
    return this.linedef;
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
