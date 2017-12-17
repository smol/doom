/// <reference path="../../../node_modules/@types/three/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Engine;
(function (Engine) {
    var WallSector = /** @class */ (function (_super) {
        __extends(WallSector, _super);
        function WallSector(vertices, direction, textureNames) {
            var _this = _super.call(this) || this;
            _this.textureNames = textureNames;
            _this.geometry = new THREE.Geometry();
            _this.material = new THREE.MeshBasicMaterial({
                transparent: true
            });
            // if (direction === 0)
            // 	this.material.side = THREE.FrontSide;
            // else
            // 	this.material.side = THREE.BackSide;
            _this.material.side = THREE.DoubleSide;
            _this.material.needsUpdate = true;
            vertices.forEach(function (vertex) {
                _this.geometry.vertices.push(vertex);
            });
            _this.geometry.faces.push(new THREE.Face3(0, 1, 2));
            _this.geometry.faces.push(new THREE.Face3(0, 2, 3));
            _this.geometry.computeFaceNormals();
            _this.geometry.computeVertexNormals();
            _this.mesh = new THREE.Mesh(_this.geometry, _this.material);
            _this.add(_this.mesh);
            return _this;
        }
        WallSector.prototype.mapTexture = function (textureSize) {
            this.geometry.computeBoundingBox();
            this.geometry.faceVertexUvs[0] = [];
            var max = this.geometry.boundingBox.max, min = this.geometry.boundingBox.min;
            var min2d = new THREE.Vector2(min.x, min.z);
            var max2d = new THREE.Vector2(max.x, max.z);
            // distance between min and zero;
            var minDistance = min2d.distanceTo(new THREE.Vector2(0, 0));
            var length = max2d.distanceTo(min2d);
            var offset = new THREE.Vector2(-minDistance, -min.y);
            var scale = new THREE.Vector2(length, (max.y - min.y));
            this.geometry.faceVertexUvs[0] = [];
            for (var i = 0; i < this.geometry.faces.length; i++) {
                var v1 = this.geometry.vertices[this.geometry.faces[i].a], v2 = this.geometry.vertices[this.geometry.faces[i].b], v3 = this.geometry.vertices[this.geometry.faces[i].c];
                var v1x = new THREE.Vector2(v1.x, v1.z).distanceTo(min2d);
                var v2x = new THREE.Vector2(v2.x, v2.z).distanceTo(min2d);
                var v3x = new THREE.Vector2(v3.x, v3.z).distanceTo(min2d);
                var v1y = (v1.y + offset.y);
                var v2y = (v2.y + offset.y);
                var v3y = (v3.y + offset.y);
                // console.info(
                // 	'min', offset.x, 
                // 	'distance', distance, 
                // 	'v1x', v1x,
                // 	'v2x', v2x,
                // 	'v3x', v3x
                // );
                this.geometry.faceVertexUvs[0].push([
                    new THREE.Vector2(v1x / scale.x, v1y / scale.y),
                    new THREE.Vector2(v2x / scale.x, v2y / scale.y),
                    new THREE.Vector2(v3x / scale.x, v3y / scale.y)
                ]);
            }
            this.geometry.uvsNeedUpdate = true;
        };
        WallSector.prototype.repeatedTexture = function (size) {
            var bounding = this.geometry.boundingBox;
            var z = bounding.max.z - bounding.min.z;
            var x = bounding.max.x - bounding.min.x;
            var scale = 1;
            var width = Math.sqrt((x * x) + (z * z));
            var height = bounding.max.y - bounding.min.y;
            var result = { x: (width / size.width) * scale, y: (height / size.height) * scale };
            // console.info('width', width, 'height', height, 'size', size, 'result', result);
            return result;
        };
        WallSector.prototype.setTexture = function (texture, offset) {
            if (texture == null) {
                return;
            }
            // console.info(texture.getName(), texture.getWidth(), texture.getHeight());
            var pixelData = [];
            var width = texture.getWidth();
            var height = texture.getHeight();
            function isPowerOf2(value) {
                return (value & (value - 1)) == 0;
            }
            var wrapping = THREE.ClampToEdgeWrapping;
            if (isPowerOf2(width) && isPowerOf2(height))
                wrapping = THREE.RepeatWrapping;
            var data = Uint8Array.from(texture.getImageData());
            this.texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping, wrapping, wrapping, THREE.NearestFilter, THREE.NearestFilter, 16, THREE.LinearEncoding);
            this.mapTexture({ width: width, height: height });
            this.texture.needsUpdate = true;
            this.mesh.material.map = this.texture;
        };
        WallSector.prototype.getFloorTexture = function () {
            return this.textureNames.floor;
        };
        WallSector.prototype.getCeilingTexture = function () {
            return this.textureNames.ceiling;
        };
        WallSector.prototype.getVertexes = function () {
            return this.geometry.vertices;
        };
        return WallSector;
    }(THREE.Group));
    Engine.WallSector = WallSector;
    var Wall = /** @class */ (function (_super) {
        __extends(Wall, _super);
        function Wall(textures) {
            var _this = _super.call(this) || this;
            _this.textures = textures;
            return _this;
        }
        Wall.prototype.setVertexes = function (firstVertex, secondVertex, rightSidedef, leftSidedef, seg) {
            var rightSector = rightSidedef.getSector();
            if (leftSidedef) {
                var leftSector = leftSidedef.getSector();
                var upperFloorHeight = leftSidedef.getSector().getCeilingHeight();
                var upperCeilingHeight = rightSidedef.getSector().getCeilingHeight();
                var lowerFloorHeight = rightSidedef.getSector().getFloorHeight();
                var lowerCeilingHeight = leftSidedef.getSector().getFloorHeight();
                this.lowerSector = new WallSector([
                    new THREE.Vector3(firstVertex.x, lowerFloorHeight, firstVertex.y),
                    new THREE.Vector3(firstVertex.x, lowerCeilingHeight, firstVertex.y),
                    new THREE.Vector3(secondVertex.x, lowerCeilingHeight, secondVertex.y),
                    new THREE.Vector3(secondVertex.x, lowerFloorHeight, secondVertex.y),
                ], seg.getDirection(), { floor: rightSector.getFloorTextureName(), ceiling: leftSector.getCeilingTextureName() });
                this.add(this.lowerSector);
                this.lowerSector.setTexture(this.getTexture(rightSidedef.getLower()), rightSidedef.getPosition());
                this.upperSector = new WallSector([
                    new THREE.Vector3(firstVertex.x, upperFloorHeight, firstVertex.y),
                    new THREE.Vector3(firstVertex.x, upperCeilingHeight, firstVertex.y),
                    new THREE.Vector3(secondVertex.x, upperCeilingHeight, secondVertex.y),
                    new THREE.Vector3(secondVertex.x, upperFloorHeight, secondVertex.y),
                ], seg.getDirection(), { floor: leftSector.getFloorTextureName(), ceiling: rightSector.getCeilingTextureName() });
                this.add(this.upperSector);
                this.upperSector.setTexture(this.getTexture(rightSidedef.getUpper()), rightSidedef.getPosition());
            }
            else {
                var ceilingHeight = rightSidedef.getSector().getCeilingHeight();
                var floorHeight = rightSidedef.getSector().getFloorHeight();
                this.middleSector = new WallSector([
                    new THREE.Vector3(firstVertex.x, floorHeight, firstVertex.y),
                    new THREE.Vector3(firstVertex.x, ceilingHeight, firstVertex.y),
                    new THREE.Vector3(secondVertex.x, ceilingHeight, secondVertex.y),
                    new THREE.Vector3(secondVertex.x, floorHeight, secondVertex.y),
                ], seg.getDirection(), { floor: rightSector.getFloorTextureName(), ceiling: rightSector.getCeilingTextureName() });
                this.add(this.middleSector);
                this.middleSector.setTexture(this.getTexture(rightSidedef.getMiddle()), rightSidedef.getPosition());
            }
        };
        Wall.prototype.getTexture = function (name) {
            // console.info(name);
            for (var t = 0; t < this.textures.length; t++) {
                var textures = this.textures[t].getTextures();
                for (var t2 = 0; t2 < textures.length; t2++) {
                    if (textures[t2].getName() == name) {
                        return textures[t2].getPatches()[0].pname.getGraphics();
                    }
                }
            }
            return null;
        };
        Wall.prototype.getFloorTexture = function () {
            if (this.lowerSector)
                return this.lowerSector.getFloorTexture();
            return this.middleSector.getFloorTexture();
        };
        Wall.prototype.getCeilingTexture = function () {
            if (this.upperSector)
                return this.upperSector.getCeilingTexture();
            return this.middleSector.getCeilingTexture();
        };
        Wall.prototype.getUpperVertexes = function () {
            if (this.upperSector)
                return this.upperSector.getVertexes();
            return [];
        };
        Wall.prototype.getLowerSector = function () {
            if (this.lowerSector)
                return this.lowerSector;
            return null;
        };
        Wall.prototype.getMiddleSector = function () {
            if (this.middleSector)
                return this.middleSector;
            return null;
        };
        return Wall;
    }(THREE.Group));
    Engine.Wall = Wall;
})(Engine || (Engine = {}));
