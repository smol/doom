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
var STATE = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_DOLLY: 4,
    TOUCH_PAN: 5
};
var CHANGE_EVENT = { type: 'change' };
var START_EVENT = { type: 'start' };
var END_EVENT = { type: 'end' };
var EPS = 0.000001;
var Engine;
(function (Engine) {
    var OrbitControls = (function (_super) {
        __extends(OrbitControls, _super);
        function OrbitControls(object, domElement, domWindow) {
            var _this = _super.call(this) || this;
            _this.object = object;
            _this.domElement = (domElement !== undefined) ? domElement : document;
            _this.window = (domWindow !== undefined) ? domWindow : window;
            _this.enabled = true;
            _this.target = new THREE.Vector3();
            _this.minDistance = 0;
            _this.maxDistance = Infinity;
            _this.minZoom = 0;
            _this.maxZoom = Infinity;
            _this.minPolarAngle = 0;
            _this.maxPolarAngle = Math.PI;
            _this.minAzimuthAngle = -Infinity;
            _this.maxAzimuthAngle = Infinity;
            _this.enableDamping = false;
            _this.dampingFactor = 0.25;
            _this.enableZoom = true;
            _this.zoomSpeed = 1.0;
            _this.enableRotate = true;
            _this.rotateSpeed = 1.0;
            _this.enablePan = true;
            _this.keyPanSpeed = 7.0;
            _this.autoRotate = false;
            _this.autoRotateSpeed = 2.0;
            _this.enableKeys = true;
            _this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
            _this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
            _this.target0 = _this.target.clone();
            _this.position0 = _this.object.position.clone();
            _this.zoom0 = _this.object.zoom;
            _this.updateOffset = new THREE.Vector3();
            _this.updateQuat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
            _this.updateQuatInverse = _this.updateQuat.clone().inverse();
            _this.updateLastPosition = new THREE.Vector3();
            _this.updateLastQuaternion = new THREE.Quaternion();
            _this.state = STATE.NONE;
            _this.scale = 1;
            _this.spherical = new THREE.Spherical();
            _this.sphericalDelta = new THREE.Spherical();
            _this.panOffset = new THREE.Vector3();
            _this.zoomChanged = false;
            _this.rotateStart = new THREE.Vector2();
            _this.rotateEnd = new THREE.Vector2();
            _this.rotateDelta = new THREE.Vector2();
            _this.panStart = new THREE.Vector2();
            _this.panEnd = new THREE.Vector2();
            _this.panDelta = new THREE.Vector2();
            _this.dollyStart = new THREE.Vector2();
            _this.dollyEnd = new THREE.Vector2();
            _this.dollyDelta = new THREE.Vector2();
            _this.panLeftV = new THREE.Vector3();
            _this.panUpV = new THREE.Vector3();
            _this.panInternalOffset = new THREE.Vector3();
            _this.onMouseDown = function (event) {
                if (_this.enabled === false)
                    return;
                event.preventDefault();
                if (event.button === _this.mouseButtons.ORBIT) {
                    if (_this.enableRotate === false)
                        return;
                    _this.rotateStart.set(event.clientX, event.clientY);
                    _this.state = STATE.ROTATE;
                }
                else if (event.button === _this.mouseButtons.ZOOM) {
                    if (_this.enableZoom === false)
                        return;
                    _this.dollyStart.set(event.clientX, event.clientY);
                    _this.state = STATE.DOLLY;
                }
                else if (event.button === _this.mouseButtons.PAN) {
                    if (_this.enablePan === false)
                        return;
                    _this.panStart.set(event.clientX, event.clientY);
                    _this.state = STATE.PAN;
                }
                if (_this.state !== STATE.NONE) {
                    document.addEventListener('mousemove', _this.onMouseMove, false);
                    document.addEventListener('mouseup', _this.onMouseUp, false);
                    _this.dispatchEvent(START_EVENT);
                }
            };
            _this.onMouseMove = function (event) {
                if (_this.enabled === false)
                    return;
                event.preventDefault();
                if (_this.state === STATE.ROTATE) {
                    if (_this.enableRotate === false)
                        return;
                    _this.rotateEnd.set(event.clientX, event.clientY);
                    _this.rotateDelta.subVectors(_this.rotateEnd, _this.rotateStart);
                    var element = _this.domElement === document ? _this.domElement.body : _this.domElement;
                    _this.rotateLeft(2 * Math.PI * _this.rotateDelta.x / element.clientWidth * _this.rotateSpeed);
                    _this.rotateUp(2 * Math.PI * _this.rotateDelta.y / element.clientHeight * _this.rotateSpeed);
                    _this.rotateStart.copy(_this.rotateEnd);
                    _this.update();
                }
                else if (_this.state === STATE.DOLLY) {
                    if (_this.enableZoom === false)
                        return;
                    _this.dollyEnd.set(event.clientX, event.clientY);
                    _this.dollyDelta.subVectors(_this.dollyEnd, _this.dollyStart);
                    if (_this.dollyDelta.y > 0) {
                        _this.dollyIn(_this.getZoomScale());
                    }
                    else if (_this.dollyDelta.y < 0) {
                        _this.dollyOut(_this.getZoomScale());
                    }
                    _this.dollyStart.copy(_this.dollyEnd);
                    _this.update();
                }
                else if (_this.state === STATE.PAN) {
                    if (_this.enablePan === false)
                        return;
                    _this.panEnd.set(event.clientX, event.clientY);
                    _this.panDelta.subVectors(_this.panEnd, _this.panStart);
                    _this.pan(_this.panDelta.x, _this.panDelta.y);
                    _this.panStart.copy(_this.panEnd);
                    _this.update();
                }
            };
            _this.onMouseUp = function (event) {
                if (_this.enabled === false)
                    return;
                document.removeEventListener('mousemove', _this.onMouseMove, false);
                document.removeEventListener('mouseup', _this.onMouseUp, false);
                _this.dispatchEvent(END_EVENT);
                _this.state = STATE.NONE;
            };
            _this.onMouseWheel = function (event) {
                if (_this.enabled === false || _this.enableZoom === false || (_this.state !== STATE.NONE && _this.state !== STATE.ROTATE))
                    return;
                event.preventDefault();
                event.stopPropagation();
                if (event.deltaY < 0) {
                    _this.dollyOut(_this.getZoomScale());
                }
                else if (event.deltaY > 0) {
                    _this.dollyIn(_this.getZoomScale());
                }
                _this.update();
                _this.dispatchEvent(START_EVENT);
                _this.dispatchEvent(END_EVENT);
            };
            _this.onKeyDown = function (event) {
                if (_this.enabled === false || _this.enableKeys === false || _this.enablePan === false)
                    return;
                switch (event.keyCode) {
                    case _this.keys.UP:
                        {
                            _this.pan(0, _this.keyPanSpeed);
                            _this.update();
                        }
                        break;
                    case _this.keys.BOTTOM:
                        {
                            _this.pan(0, -_this.keyPanSpeed);
                            _this.update();
                        }
                        break;
                    case _this.keys.LEFT:
                        {
                            _this.pan(_this.keyPanSpeed, 0);
                            _this.update();
                        }
                        break;
                    case _this.keys.RIGHT:
                        {
                            _this.pan(-_this.keyPanSpeed, 0);
                            _this.update();
                        }
                        break;
                }
            };
            _this.onTouchStart = function (event) {
                if (_this.enabled === false)
                    return;
                switch (event.touches.length) {
                    case 1:
                        {
                            if (_this.enableRotate === false)
                                return;
                            _this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                            _this.state = STATE.TOUCH_ROTATE;
                        }
                        break;
                    case 2:
                        {
                            if (_this.enableZoom === false)
                                return;
                            var dx = event.touches[0].pageX - event.touches[1].pageX;
                            var dy = event.touches[0].pageY - event.touches[1].pageY;
                            var distance = Math.sqrt(dx * dx + dy * dy);
                            _this.dollyStart.set(0, distance);
                            _this.state = STATE.TOUCH_DOLLY;
                        }
                        break;
                    case 3:
                        {
                            if (_this.enablePan === false)
                                return;
                            _this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                            _this.state = STATE.TOUCH_PAN;
                        }
                        break;
                    default: {
                        _this.state = STATE.NONE;
                    }
                }
                if (_this.state !== STATE.NONE) {
                    _this.dispatchEvent(START_EVENT);
                }
            };
            _this.onTouchMove = function (event) {
                if (_this.enabled === false)
                    return;
                event.preventDefault();
                event.stopPropagation();
                switch (event.touches.length) {
                    case 1:
                        {
                            if (_this.enableRotate === false)
                                return;
                            if (_this.state !== STATE.TOUCH_ROTATE)
                                return;
                            _this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                            _this.rotateDelta.subVectors(_this.rotateEnd, _this.rotateStart);
                            var element = _this.domElement === document ? _this.domElement.body : _this.domElement;
                            _this.rotateLeft(2 * Math.PI * _this.rotateDelta.x / element.clientWidth * _this.rotateSpeed);
                            _this.rotateUp(2 * Math.PI * _this.rotateDelta.y / element.clientHeight * _this.rotateSpeed);
                            _this.rotateStart.copy(_this.rotateEnd);
                            _this.update();
                        }
                        break;
                    case 2:
                        {
                            if (_this.enableZoom === false)
                                return;
                            if (_this.state !== STATE.TOUCH_DOLLY)
                                return;
                            var dx = event.touches[0].pageX - event.touches[1].pageX;
                            var dy = event.touches[0].pageY - event.touches[1].pageY;
                            var distance = Math.sqrt(dx * dx + dy * dy);
                            _this.dollyEnd.set(0, distance);
                            _this.dollyDelta.subVectors(_this.dollyEnd, _this.dollyStart);
                            if (_this.dollyDelta.y > 0) {
                                _this.dollyOut(_this.getZoomScale());
                            }
                            else if (_this.dollyDelta.y < 0) {
                                _this.dollyIn(_this.getZoomScale());
                            }
                            _this.dollyStart.copy(_this.dollyEnd);
                            _this.update();
                        }
                        break;
                    case 3:
                        {
                            if (_this.enablePan === false)
                                return;
                            if (_this.state !== STATE.TOUCH_PAN)
                                return;
                            _this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                            _this.panDelta.subVectors(_this.panEnd, _this.panStart);
                            _this.pan(_this.panDelta.x, _this.panDelta.y);
                            _this.panStart.copy(_this.panEnd);
                            _this.update();
                        }
                        break;
                    default: {
                        _this.state = STATE.NONE;
                    }
                }
            };
            _this.onTouchEnd = function (event) {
                if (_this.enabled === false)
                    return;
                _this.dispatchEvent(END_EVENT);
                _this.state = STATE.NONE;
            };
            _this.onContextMenu = function (event) {
                event.preventDefault();
            };
            _this.domElement.addEventListener('contextmenu', _this.onContextMenu, false);
            _this.domElement.addEventListener('mousedown', _this.onMouseDown, false);
            _this.domElement.addEventListener('wheel', _this.onMouseWheel, false);
            _this.domElement.addEventListener('touchstart', _this.onTouchStart, false);
            _this.domElement.addEventListener('touchend', _this.onTouchEnd, false);
            _this.domElement.addEventListener('touchmove', _this.onTouchMove, false);
            _this.window.addEventListener('keydown', _this.onKeyDown, false);
            _this.update();
            return _this;
        }
        OrbitControls.prototype.update = function () {
            var position = this.object.position;
            this.updateOffset.copy(position).sub(this.target);
            this.updateOffset.applyQuaternion(this.updateQuat);
            this.spherical.setFromVector3(this.updateOffset);
            if (this.autoRotate && this.state === STATE.NONE) {
                this.rotateLeft(this.getAutoRotationAngle());
            }
            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;
            this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
            this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
            this.spherical.makeSafe();
            this.spherical.radius *= this.scale;
            this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
            this.target.add(this.panOffset);
            this.updateOffset.setFromSpherical(this.spherical);
            this.updateOffset.applyQuaternion(this.updateQuatInverse);
            position.copy(this.target).add(this.updateOffset);
            this.object.lookAt(this.target);
            if (this.enableDamping === true) {
                this.sphericalDelta.theta *= (1 - this.dampingFactor);
                this.sphericalDelta.phi *= (1 - this.dampingFactor);
            }
            else {
                this.sphericalDelta.set(0, 0, 0);
            }
            this.scale = 1;
            this.panOffset.set(0, 0, 0);
            if (this.zoomChanged ||
                this.updateLastPosition.distanceToSquared(this.object.position) > EPS ||
                8 * (1 - this.updateLastQuaternion.dot(this.object.quaternion)) > EPS) {
                this.dispatchEvent(CHANGE_EVENT);
                this.updateLastPosition.copy(this.object.position);
                this.updateLastQuaternion.copy(this.object.quaternion);
                this.zoomChanged = false;
                return true;
            }
            return false;
        };
        OrbitControls.prototype.panLeft = function (distance, objectMatrix) {
            this.panLeftV.setFromMatrixColumn(objectMatrix, 0);
            this.panLeftV.multiplyScalar(-distance);
            this.panOffset.add(this.panLeftV);
        };
        OrbitControls.prototype.panUp = function (distance, objectMatrix) {
            this.panUpV.setFromMatrixColumn(objectMatrix, 1);
            this.panUpV.multiplyScalar(distance);
            this.panOffset.add(this.panUpV);
        };
        OrbitControls.prototype.pan = function (deltaX, deltaY) {
            var element = this.domElement === document ? this.domElement.body : this.domElement;
            if (this.object instanceof THREE.PerspectiveCamera) {
                var position = this.object.position;
                this.panInternalOffset.copy(position).sub(this.target);
                var targetDistance = this.panInternalOffset.length();
                targetDistance *= Math.tan((this.object.fov / 2) * Math.PI / 180.0);
                this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this.object.matrix);
                this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix);
            }
            else if (this.object instanceof THREE.OrthographicCamera) {
                this.panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix);
                this.panUp(deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix);
            }
            else {
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                this.enablePan = false;
            }
        };
        OrbitControls.prototype.dollyIn = function (dollyScale) {
            if (this.object instanceof THREE.PerspectiveCamera) {
                this.scale /= dollyScale;
            }
            else if (this.object instanceof THREE.OrthographicCamera) {
                this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
                this.object.updateProjectionMatrix();
                this.zoomChanged = true;
            }
            else {
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
                this.enableZoom = false;
            }
        };
        OrbitControls.prototype.dollyOut = function (dollyScale) {
            if (this.object instanceof THREE.PerspectiveCamera) {
                this.scale *= dollyScale;
            }
            else if (this.object instanceof THREE.OrthographicCamera) {
                this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
                this.object.updateProjectionMatrix();
                this.zoomChanged = true;
            }
            else {
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
                this.enableZoom = false;
            }
        };
        OrbitControls.prototype.getAutoRotationAngle = function () {
            return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
        };
        OrbitControls.prototype.getZoomScale = function () {
            return Math.pow(0.95, this.zoomSpeed);
        };
        OrbitControls.prototype.rotateLeft = function (angle) {
            this.sphericalDelta.theta -= angle;
        };
        OrbitControls.prototype.rotateUp = function (angle) {
            this.sphericalDelta.phi -= angle;
        };
        OrbitControls.prototype.getPolarAngle = function () {
            return this.spherical.phi;
        };
        OrbitControls.prototype.getAzimuthalAngle = function () {
            return this.spherical.theta;
        };
        OrbitControls.prototype.dispose = function () {
            this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
            this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
            this.domElement.removeEventListener('wheel', this.onMouseWheel, false);
            this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
            this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
            this.domElement.removeEventListener('touchmove', this.onTouchMove, false);
            document.removeEventListener('mousemove', this.onMouseMove, false);
            document.removeEventListener('mouseup', this.onMouseUp, false);
            this.window.removeEventListener('keydown', this.onKeyDown, false);
        };
        OrbitControls.prototype.reset = function () {
            this.target.copy(this.target0);
            this.object.position.copy(this.position0);
            this.object.zoom = this.zoom0;
            this.object.updateProjectionMatrix();
            this.dispatchEvent(CHANGE_EVENT);
            this.update();
            this.state = STATE.NONE;
        };
        Object.defineProperty(OrbitControls.prototype, "center", {
            get: function () {
                console.warn('THREE.OrbitControls: .center has been renamed to .target');
                return this.target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitControls.prototype, "noZoom", {
            get: function () {
                console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
                return !this.enableZoom;
            },
            set: function (value) {
                console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
                this.enableZoom = !value;
            },
            enumerable: true,
            configurable: true
        });
        return OrbitControls;
    }(THREE.EventDispatcher));
    Engine.OrbitControls = OrbitControls;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var WallSector = (function (_super) {
        __extends(WallSector, _super);
        function WallSector(vertices) {
            var _this = _super.call(this) || this;
            _this.geometry = new THREE.Geometry();
            _this.material = new THREE.MeshBasicMaterial({
                transparent: true,
            });
            _this.material.side = THREE.DoubleSide;
            _this.material.needsUpdate = true;
            vertices.forEach(function (vertex) {
                _this.geometry.vertices.push(vertex);
            });
            _this.geometry.faces.push(new THREE.Face3(0, 1, 2));
            _this.geometry.faces.push(new THREE.Face3(0, 2, 3));
            _this.geometry.faceVertexUvs[0] = [];
            _this.geometry.faceVertexUvs[0].push([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(0, 1),
                new THREE.Vector2(1, 1),
            ]);
            _this.geometry.faceVertexUvs[0].push([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 0),
            ]);
            _this.geometry.computeBoundingBox();
            _this.geometry.computeFaceNormals();
            _this.geometry.computeVertexNormals();
            _this.mesh = new THREE.Mesh(_this.geometry, _this.material);
            _this.add(_this.mesh);
            return _this;
        }
        WallSector.prototype.setTexture = function (texture) {
            if (texture == null) {
                return;
            }
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
            this.texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping, wrapping, wrapping, THREE.NearestFilter, THREE.LinearFilter, 16, THREE.LinearEncoding);
            this.texture.needsUpdate = true;
            this.mesh.material.map = this.texture;
        };
        WallSector.prototype.getVertexes = function () {
            return this.geometry.vertices;
        };
        return WallSector;
    }(THREE.Group));
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(textures) {
            var _this = _super.call(this) || this;
            _this.textures = textures;
            return _this;
        }
        Wall.prototype.setVertexes = function (firstVertex, secondVertex, rightSidedef, leftSidedef) {
            if (leftSidedef) {
                var upperFloorHeight = leftSidedef.getSector().getCeilingHeight();
                var upperCeilingHeight = rightSidedef.getSector().getCeilingHeight();
                var lowerFloorHeight = rightSidedef.getSector().getFloorHeight();
                var lowerCeilingHeight = leftSidedef.getSector().getFloorHeight();
                this.lowerSector = new WallSector([
                    new THREE.Vector3(firstVertex.x / 5, lowerFloorHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(firstVertex.x / 5, lowerCeilingHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, lowerCeilingHeight / 5, secondVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, lowerFloorHeight / 5, secondVertex.y / 5),
                ]);
                this.add(this.lowerSector);
                this.lowerSector.setTexture(this.getTexture(rightSidedef.getLower()));
                this.upperSector = new WallSector([
                    new THREE.Vector3(firstVertex.x / 5, upperFloorHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(firstVertex.x / 5, upperCeilingHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, upperCeilingHeight / 5, secondVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, upperFloorHeight / 5, secondVertex.y / 5),
                ]);
                this.add(this.upperSector);
                this.upperSector.setTexture(this.getTexture(rightSidedef.getUpper()));
            }
            else {
                var ceilingHeight = rightSidedef.getSector().getCeilingHeight();
                var floorHeight = rightSidedef.getSector().getFloorHeight();
                this.middleSector = new WallSector([
                    new THREE.Vector3(firstVertex.x / 5, floorHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(firstVertex.x / 5, ceilingHeight / 5, firstVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, ceilingHeight / 5, secondVertex.y / 5),
                    new THREE.Vector3(secondVertex.x / 5, floorHeight / 5, secondVertex.y / 5),
                ]);
                this.add(this.middleSector);
                this.middleSector.setTexture(this.getTexture(rightSidedef.getMiddle()));
            }
        };
        Wall.prototype.getTexture = function (name) {
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
        Wall.prototype.getUpperVertexes = function () {
            return this.upperSector.getVertexes();
        };
        Wall.prototype.getLowerVertexes = function () {
            if (this.lowerSector)
                return this.lowerSector.getVertexes();
            return [];
        };
        Wall.prototype.getMiddleVertexes = function () {
            return this.middleSector.getVertexes();
        };
        return Wall;
    }(THREE.Group));
    Engine.Wall = Wall;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Core = (function () {
        function Core(canvas) {
            var renderer = new THREE.WebGLRenderer({ canvas: canvas });
            this.initScene(canvas);
            this.initCamera(canvas);
            canvas.addEventListener('mousedown', onDocumentMouseDown);
            var raycaster = new THREE.Raycaster();
            raycaster.params.Points.threshold = 0.1;
            var self = this;
            function animate() {
                requestAnimationFrame(animate);
                render();
            }
            function render() {
                renderer.render(self.scene, self.camera);
            }
            function onDocumentMouseDown(event) {
                event.preventDefault();
                var y = event.clientY - canvas.getBoundingClientRect().top;
                var mouse3D = new THREE.Vector2((event.clientX / canvas.width) * 2 - 1, -(y / canvas.height) * 2 + 1);
                raycaster.setFromCamera(mouse3D, self.camera);
                var intersects = raycaster.intersectObjects(self.scene.children, true);
                console.info(mouse3D, intersects);
                if (intersects.length > 0) {
                    var floor = intersects[0].object.parent.parent.parent;
                    console.info(floor.seg);
                }
            }
            animate();
        }
        Core.prototype.initCamera = function (canvas) {
            this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
            this.camera.far = Infinity;
            this.camera.position.x = 500;
            this.camera.position.y = 500;
            this.camera.position.z = 500;
            var controls = new Engine.OrbitControls(this.camera, canvas);
        };
        Core.prototype.initScene = function (canvas) {
            this.scene = new THREE.Scene();
            var axis = new THREE.AxisHelper(10);
            this.scene.add(axis);
            var light = new THREE.DirectionalLight(0xffffff, 1.0);
            light.position.set(100, 100, 100);
            this.scene.add(light);
            var light2 = new THREE.DirectionalLight(0xffffff, 1.0);
            light2.position.set(-100, 100, -100);
            this.scene.add(light2);
        };
        Core.prototype.node = function (level, node) {
            if (node === null)
                return;
            this.subsector(node.getRightSubsector());
            this.subsector(node.getLeftSubsector());
            this.node(level + 1, node.getLeftNode());
            this.node(level + 1, node.getRightNode());
        };
        Core.prototype.subsector = function (subsector) {
            if (subsector !== null) {
                var sector = new Engine.Sector(subsector, this.textures, this.scene);
            }
        };
        Core.prototype.createWalls = function (map, wad) {
            this.textures = wad.getTextures();
            this.node(0, map.getNode());
        };
        return Core;
    }());
    Engine.Core = Core;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Floor = (function (_super) {
        __extends(Floor, _super);
        function Floor(textures) {
            var _this = _super.call(this) || this;
            _this.textures = textures;
            _this.material = new THREE.MeshBasicMaterial({
                transparent: true,
                color: 0x00FF00
            });
            _this.material.side = THREE.DoubleSide;
            _this.material.needsUpdate = true;
            _this.geometry = new THREE.Geometry();
            return _this;
        }
        Floor.prototype.createFaces = function () {
            for (var i = 0; i < this.geometry.vertices.length; i++) {
                if (i > 1)
                    this.geometry.faces.push(new THREE.Face3(0, i - 1, i));
            }
        };
        Floor.prototype.addVertex = function (vertex) {
            this.geometry.vertices.push(vertex);
        };
        Floor.prototype.create = function () {
            this.createFaces();
            this.geometry.computeFaceNormals();
            this.geometry.computeVertexNormals();
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.add(this.mesh);
        };
        return Floor;
    }(THREE.Group));
    Engine.Floor = Floor;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Sector = (function () {
        function Sector(subsector, textures, scene) {
            this.textures = textures;
            this.walls = [];
            var segs = subsector.getSegs();
            if (segs.length > 1) {
                this.floor = new Engine.Floor(textures);
                scene.add(this.floor);
                for (var i = 0; i < segs.length; i++) {
                    scene.add(this.createWall(segs[i]));
                }
                this.createFloor();
            }
        }
        Sector.prototype.createFloor = function () {
            this.walls.forEach(function (wall) {
                var middleVertices = wall.getMiddleVertexes();
                var lowerVertices = wall.getLowerVertexes();
                var upperVertices = wall.getUpperVertexes();
                if (lowerVertices.length > 1) {
                }
            });
            this.floor.create();
        };
        Sector.prototype.createWall = function (seg) {
            var linedef = seg.getLinedef();
            var rightSidedef = linedef.getRightSidedef();
            var leftSidedef = linedef.getLeftSidedef();
            var wall = new Engine.Wall(this.textures);
            var startVertex = new THREE.Vector2(seg.getStartVertex().x, seg.getStartVertex().y);
            var endVertex = new THREE.Vector2(seg.getEndVertex().x, seg.getEndVertex().y);
            wall.setVertexes(startVertex, endVertex, rightSidedef, leftSidedef);
            this.walls.push(wall);
            return wall;
        };
        return Sector;
    }());
    Engine.Sector = Sector;
})(Engine || (Engine = {}));
//# sourceMappingURL=index.js.map