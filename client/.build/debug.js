/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var treeview_1 = __webpack_require__(2);
var playpal_debug_1 = __webpack_require__(3);
var graphic_debug_1 = __webpack_require__(4);
var colormap_debug_1 = __webpack_require__(5);
var nodes_debug_1 = __webpack_require__(6);
var endoom_debug_1 = __webpack_require__(7);
var map_debug_1 = __webpack_require__(8);
var music_debug_1 = __webpack_require__(9);
var vertexes_debug_1 = __webpack_require__(10);
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(11);
var Debug;
(function (Debug_1) {
    var Debug = (function (_super) {
        __extends(Debug, _super);
        function Debug(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { currentItem: null };
            _this.items = [
                { label: "PLAYPAL", component: React.createElement(playpal_debug_1.Debug.Playpal, { playpal: _this.props.wad.getPlaypal() }), children: [] },
                { label: "COLORMAP", component: React.createElement(colormap_debug_1.Debug.ColorMap, { colorMap: _this.props.wad.getColorMap() }), children: [] },
                { label: "ENDOOM", component: React.createElement(endoom_debug_1.Debug.Endoom, { endoom: _this.props.wad.getEndoom() }), children: [] },
                { label: "GRAPHICS", component: null, children: _this.getGraphics() },
                { label: "MUSICS", component: null, children: _this.getMusics() },
                { label: "MAPS", component: null, children: _this.getMaps() }
            ];
            _this.selectItem = _this.selectItem.bind(_this);
            return _this;
        }
        Debug.prototype.getMaps = function () {
            var _this = this;
            var datas = [];
            datas = this.props.wad.getMaps().map(function (map) {
                var data = {
                    label: map.getName(),
                    component: React.createElement(map_debug_1.Debug.Map, { map: map, wad: _this.props.wad }),
                    children: []
                };
                data.children = [
                    { label: "THINGS", component: React.createElement(map_debug_1.Debug.Things, { things: map.getThings() }), children: [] },
                    { label: "VERTEXES", component: React.createElement(vertexes_debug_1.Debug.Vertexes, { vertexes: map.getVertexes(), linedefs: map.getLinedefs() }), children: [] },
                    { label: "NODES", component: null, children: _this.getNodes(map) }
                ];
                return data;
            });
            return datas;
        };
        Debug.prototype.getNodes = function (map) {
            var datas = [];
            var nodes = map.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                datas.push({ label: "NODE " + i, component: React.createElement(nodes_debug_1.Debug.Nodes, { vertexes: map.getVertexes(), linedefs: map.getLinedefs(), node: nodes[i] }), children: [] });
            }
            return datas;
        };
        Debug.prototype.getMusics = function () {
            var data = [];
            data = this.props.wad.getMusics().map(function (music) {
                return { label: music.getName(), component: React.createElement(music_debug_1.Debug.Music, { music: music }), children: [] };
            });
            return data;
        };
        Debug.prototype.getGraphics = function () {
            var datasGraphics = [];
            var graphics = this.props.wad.getGraphics();
            for (var i = 0; i < graphics.length; i++) {
                datasGraphics.push({ label: graphics[i].getName(), component: React.createElement(graphic_debug_1.Debug.Graphic, { graphic: graphics[i] }), children: null });
            }
            return [
                { label: "GRAPHICS", component: null, children: datasGraphics },
                { label: "TEXTURES", component: null, children: this.getTextures() },
                { label: "FLATS", component: null, children: this.getFlats() }
            ];
        };
        Debug.prototype.getFlats = function () {
            var dataFlats = [];
            var flats = this.props.wad.getFlats();
            for (var i = 0; i < flats.length; i++) {
                dataFlats.push({ label: flats[i].getName(), component: React.createElement(graphic_debug_1.Debug.Flat, { flat: flats[i] }), children: null });
            }
            return dataFlats;
        };
        Debug.prototype.getTextures = function () {
            var dataTextures = [];
            var textures = this.props.wad.getTextures();
            for (var i = 0; i < textures.length; i++) {
                var dataTexture = { label: textures[i].getName(), component: null, children: [] };
                var texturesList = textures[i].getTextures();
                for (var j = 0; j < texturesList.length; j++) {
                    dataTexture.children.push({ label: texturesList[j].getName(), component: null, children: null });
                }
                dataTextures.push(dataTexture);
            }
            return dataTextures;
        };
        Debug.prototype.selectItem = function (item) {
            this.setState(function (prevState) { return ({
                currentItem: item
            }); });
        };
        Debug.prototype.render = function () {
            return React.createElement("div", null,
                React.createElement(treeview_1.Debug.TreeView, { items: this.items, select: this.selectItem }),
                React.createElement("div", { id: "details" }, this.state.currentItem));
        };
        return Debug;
    }(React.Component));
    Debug_1.Debug = Debug;
})(Debug || (Debug = {}));
var parser = new Wad.Parser();
var builder = new Wad.Builder(parser);
parser.onLoad = function () {
    builder.go();
    ReactDOM.render(React.createElement(Debug.Debug, { wad: builder.getWad(), builder: builder }), document.getElementById("debug"));
};
parser.loadFile('/client/assets/doom.wad');


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { items: [_this.props.items] };
            _this.select = _this.select.bind(_this);
            return _this;
        }
        TreeView.prototype.select = function (item, level) {
            if (item.component !== null) {
                console.warn(item.label);
                this.props.select(item.component);
            }
            this.state.items.splice(level + 1, (this.state.items.length - level));
            var items = this.state.items;
            if (item.children !== null && item.children.length > 0) {
                items.push(item.children);
                this.setState({ items: items });
            }
        };
        TreeView.prototype.buildTreeView = function (items, level) {
            var _this = this;
            if (items.length === 0) {
                return null;
            }
            var i = 0;
            var labels = items.map(function (item) {
                return React.createElement("li", { key: item.label + i++, onClick: function () { _this.select(item, level); } }, item.label);
            });
            return React.createElement("ul", { key: "groups" + level, className: "groups " + level }, labels);
        };
        TreeView.prototype.render = function () {
            var _this = this;
            var i = 0;
            var treeviews = this.state.items.map(function (item) {
                return _this.buildTreeView(item, i++);
            });
            return React.createElement("div", { id: "treeview" }, treeviews);
        };
        return TreeView;
    }(React.Component));
    Debug.TreeView = TreeView;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Playpal = (function (_super) {
        __extends(Playpal, _super);
        function Playpal() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Playpal.prototype.render = function () {
            var i = 0;
            var swatches = this.props.playpal.getColors().map(function (element) {
                return React.createElement(Swatch, { key: 'swatch-' + i, swatchId: i++, colors: element });
            });
            return React.createElement("div", { id: "preview", className: "playpal" }, swatches);
        };
        return Playpal;
    }(React.Component));
    Debug.Playpal = Playpal;
})(Debug = exports.Debug || (exports.Debug = {}));
var Swatch = (function (_super) {
    __extends(Swatch, _super);
    function Swatch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Swatch.prototype.render = function () {
        var _this = this;
        var i = 0;
        var colors = this.props.colors.map(function (color) {
            return React.createElement("div", { key: '#' + _this.props.swatchId + '-' + color.r + ',' + color.g + ',' + color.b + '-' + i++, className: "item", style: { backgroundColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)' } });
        });
        return React.createElement("div", { className: "swatch" }, colors);
    };
    return Swatch;
}(React.Component));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Graphic = (function (_super) {
        __extends(Graphic, _super);
        function Graphic(props) {
            return _super.call(this, props) || this;
        }
        Graphic.prototype.componentDidMount = function () {
            this.updateCanvas(this.props.graphic);
        };
        Graphic.prototype.updateCanvas = function (graphic) {
            var canvas = this.refs.canvas;
            canvas.height = graphic.getHeight();
            canvas.width = graphic.getWidth();
            setTimeout(function () {
                var ctx = canvas.getContext('2d');
                var idata = ctx.createImageData(canvas.width, canvas.height);
                idata.data.set(graphic.getImageData());
                ctx.putImageData(idata, 0, 0);
            });
        };
        Graphic.prototype.componentWillReceiveProps = function (nextProps) {
            this.updateCanvas(nextProps.graphic);
        };
        Graphic.prototype.render = function () {
            return React.createElement("canvas", { className: "debug-container endoom", ref: "canvas", width: this.props.graphic.getWidth(), height: this.props.graphic.getHeight() });
        };
        return Graphic;
    }(React.Component));
    Debug.Graphic = Graphic;
    var Flat = (function (_super) {
        __extends(Flat, _super);
        function Flat(props) {
            return _super.call(this, props) || this;
        }
        Flat.prototype.componentDidMount = function () {
            this.updateCanvas(this.props.flat);
        };
        Flat.prototype.updateCanvas = function (flat) {
            var canvas = this.refs.canvas;
            canvas.height = flat.getHeight();
            canvas.width = flat.getWidth();
            setTimeout(function () {
                var ctx = canvas.getContext('2d');
                var idata = ctx.createImageData(canvas.width, canvas.height);
                idata.data.set(flat.getImageData());
                ctx.putImageData(idata, 0, 0);
            });
        };
        Flat.prototype.componentWillReceiveProps = function (nextProps) {
            this.updateCanvas(nextProps.flat);
        };
        Flat.prototype.render = function () {
            return React.createElement("canvas", { className: "debug-container endoom", ref: "canvas", width: this.props.flat.getWidth(), height: this.props.flat.getHeight() });
        };
        return Flat;
    }(React.Component));
    Debug.Flat = Flat;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var ColorMap = (function (_super) {
        __extends(ColorMap, _super);
        function ColorMap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColorMap.prototype.render = function () {
            var swatches = [];
            for (var i = 0; i < 256; i++) {
                swatches.push(React.createElement(ColorMapSwatch, { key: i, index: i, colorMap: this.props.colorMap.getColors() }));
            }
            return React.createElement("div", { id: "preview", className: "colormap" }, swatches);
        };
        return ColorMap;
    }(React.Component));
    Debug.ColorMap = ColorMap;
})(Debug = exports.Debug || (exports.Debug = {}));
var ColorMapSwatch = (function (_super) {
    __extends(ColorMapSwatch, _super);
    function ColorMapSwatch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorMapSwatch.prototype.render = function () {
        var colors = [];
        for (var i = 0; i < 34; i++) {
            var color = this.props.colorMap[(i * 256) + this.props.index];
            colors.push(React.createElement("div", { key: (i * 256) + this.props.index, className: "item", style: { backgroundColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)' } }));
        }
        return React.createElement("div", { className: "swatch" }, colors);
    };
    return ColorMapSwatch;
}(React.Component));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(props) {
            return _super.call(this, props) || this;
        }
        return Node;
    }(React.Component));
    Debug.Node = Node;
    var Nodes = (function (_super) {
        __extends(Nodes, _super);
        function Nodes(props) {
            var _this = _super.call(this, props) || this;
            _this.scale = 0.3;
            _this.mouseMove = _this.mouseMove.bind(_this);
            _this.mouseDown = _this.mouseDown.bind(_this);
            _this.scroll = _this.scroll.bind(_this);
            _this.position = { x: 700, y: 700 };
            _this.startPosition = { x: 0, y: 0 };
            return _this;
        }
        Nodes.prototype.scroll = function (e) {
            console.info(e);
        };
        Nodes.prototype.mouseMove = function (e) {
            if (e.buttons === 0) {
                return;
            }
            this.position = {
                x: this.position.x + ((e.screenX - this.startPosition.x) * (1 / this.scale)),
                y: this.position.y + ((e.screenY - this.startPosition.y) * (1 / this.scale))
            };
            this.update();
            this.startPosition = { x: e.screenX, y: e.screenY };
        };
        Nodes.prototype.mouseDown = function (e) {
            this.startPosition = { x: e.screenX, y: e.screenY };
        };
        Nodes.prototype.update = function () {
            var canvas = this.refs.canvas;
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            var start = {
                x: this.props.vertexes[this.props.linedefs[0].getFirst()].x,
                y: this.props.vertexes[this.props.linedefs[0].getFirst()].y,
            };
            start.x += this.position.x;
            start.y += this.position.y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < this.props.linedefs.length; i++) {
                var firstVertexIndex = this.props.linedefs[i].getFirst();
                var secondVertexIndex = this.props.linedefs[i].getSecond();
                var firstVertex = this.props.vertexes[firstVertexIndex];
                var secondVertex = this.props.vertexes[secondVertexIndex];
                ctx.beginPath();
                if (this.props.linedefs[i].getFlag() === 'Secret') {
                    ctx.strokeStyle = 'red';
                }
                else {
                    ctx.strokeStyle = 'white';
                }
                ctx.moveTo((start.x - firstVertex.x) * this.scale, (start.y - firstVertex.y) * this.scale);
                ctx.lineTo((start.x - secondVertex.x) * this.scale, (start.y - secondVertex.y) * this.scale);
                ctx.stroke();
                ctx.closePath();
            }
            console.info('RENDER NODE', this.props.node);
            this.renderNode(this.props.node, ctx, start, this.scale);
        };
        Nodes.prototype.renderNode = function (node, ctx, start, scale) {
            if (node === null) {
                return;
            }
            var rightBounds = node.getRightBounds();
            ctx.beginPath();
            ctx.moveTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.uY) * scale);
            ctx.lineTo((start.x - rightBounds.lX) * scale, (start.y - rightBounds.uY) * scale);
            ctx.lineTo((start.x - rightBounds.lX) * scale, (start.y - rightBounds.lY) * scale);
            ctx.lineTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.lY) * scale);
            ctx.lineTo((start.x - rightBounds.uX) * scale, (start.y - rightBounds.uY) * scale);
            ctx.strokeStyle = "blue";
            ctx.stroke();
            ctx.closePath();
            var leftBounds = node.getLeftBounds();
            ctx.beginPath();
            ctx.moveTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.uY) * scale);
            ctx.lineTo((start.x - leftBounds.lX) * scale, (start.y - leftBounds.uY) * scale);
            ctx.lineTo((start.x - leftBounds.lX) * scale, (start.y - leftBounds.lY) * scale);
            ctx.lineTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.lY) * scale);
            ctx.lineTo((start.x - leftBounds.uX) * scale, (start.y - leftBounds.uY) * scale);
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.closePath();
        };
        Nodes.prototype.componentWillReceiveProps = function (nextProps) {
            this.props = nextProps;
            this.update();
        };
        Nodes.prototype.componentDidMount = function () {
            this.refs.canvas.addEventListener('scroll', this.scroll);
            this.update();
        };
        Nodes.prototype.componentWillUnmount = function () {
            this.refs.canvas.removeEventListener('scroll', this.scroll);
        };
        Nodes.prototype.render = function () {
            return React.createElement("canvas", { ref: "canvas", width: window.innerWidth, height: window.innerHeight / 2, onScroll: this.scroll, onMouseMove: this.mouseMove, onMouseDown: this.mouseDown });
        };
        return Nodes;
    }(React.Component));
    Debug.Nodes = Nodes;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Endoom = (function (_super) {
        __extends(Endoom, _super);
        function Endoom() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Endoom.prototype.componentDidMount = function () {
            var canvas = this.refs.canvas;
            var ctx = canvas.getContext('2d');
            var idata = ctx.createImageData(canvas.width, canvas.height);
            idata.data.set(this.props.endoom.getData());
            ctx.putImageData(idata, 0, 0);
        };
        Endoom.prototype.render = function () {
            return React.createElement("canvas", { ref: "canvas", className: "debug-container endoom", height: 25 * 16, width: 80 * 8 });
        };
        return Endoom;
    }(React.Component));
    Debug.Endoom = Endoom;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Things = (function (_super) {
        __extends(Things, _super);
        function Things() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Things.prototype.render = function () {
            var i = 0;
            var things = this.props.things.get().map(function (thing) {
                return React.createElement("li", { key: i++ }, thing.toString());
            });
            return React.createElement("div", { id: "infos" },
                React.createElement("ul", null, things));
        };
        return Things;
    }(React.Component));
    Debug.Things = Things;
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Map.prototype.rendering = function () {
            this.core = new Engine.Core(this.refs.canvas);
            this.core.createWalls(this.props.map, this.props.wad);
        };
        Map.prototype.componentDidMount = function () {
            this.rendering();
        };
        Map.prototype.render = function () {
            return React.createElement("canvas", { ref: "canvas", width: window.innerWidth, height: window.innerHeight / 2, style: { backgroundColor: 'black' } });
        };
        return Map;
    }(React.Component));
    Debug.Map = Map;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Music = (function (_super) {
        __extends(Music, _super);
        function Music(props) {
            var _this = _super.call(this, props) || this;
            _this.audioContext = new AudioContext();
            _this.node = _this.audioContext.createBufferSource();
            return _this;
        }
        Music.prototype.componentDidMount = function () {
        };
        Music.prototype.start = function () {
            this.audioContext.resume();
        };
        Music.prototype.stop = function () {
            this.audioContext.suspend();
        };
        Music.prototype.componentWillUnmount = function () {
            this.node.stop();
        };
        Music.prototype.render = function () {
            return React.createElement("div", null,
                React.createElement("div", null, this.props.music.getName()),
                React.createElement("button", { onClick: this.start }, "START"),
                React.createElement("button", { onClick: this.stop }, "STOP"));
        };
        return Music;
    }(React.Component));
    Debug.Music = Music;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Debug;
(function (Debug) {
    var Vertexes = (function (_super) {
        __extends(Vertexes, _super);
        function Vertexes(props) {
            var _this = _super.call(this, props) || this;
            _this.mouseMove = _this.mouseMove.bind(_this);
            _this.mouseDown = _this.mouseDown.bind(_this);
            _this.position = { x: 500, y: 500 };
            _this.startPosition = { x: 0, y: 0 };
            return _this;
        }
        Vertexes.prototype.mouseMove = function (e) {
            if (e.buttons === 0) {
                return;
            }
            this.position = {
                x: this.position.x + ((e.screenX - this.startPosition.x) * 2),
                y: this.position.y + ((e.screenY - this.startPosition.y) * 2)
            };
            this.update();
            this.startPosition = { x: e.screenX, y: e.screenY };
        };
        Vertexes.prototype.mouseDown = function (e) {
            this.startPosition = { x: e.screenX, y: e.screenY };
        };
        Vertexes.prototype.update = function () {
            var canvas = this.refs.canvas;
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            var scale = 0.5;
            var start = {
                x: this.props.vertexes[this.props.linedefs[0].getFirst()].x,
                y: this.props.vertexes[this.props.linedefs[0].getFirst()].y,
            };
            start.x += this.position.x;
            start.y += this.position.y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < this.props.linedefs.length; i++) {
                var firstVertexIndex = this.props.linedefs[i].getFirst();
                var secondVertexIndex = this.props.linedefs[i].getSecond();
                var firstVertex = this.props.vertexes[firstVertexIndex];
                var secondVertex = this.props.vertexes[secondVertexIndex];
                ctx.beginPath();
                if (this.props.linedefs[i].getFlag() === 'Secret') {
                    ctx.strokeStyle = 'red';
                }
                else {
                    ctx.strokeStyle = 'white';
                }
                ctx.moveTo((start.x - firstVertex.x) * scale, (start.y - firstVertex.y) * scale);
                ctx.lineTo((start.x - secondVertex.x) * scale, (start.y - secondVertex.y) * scale);
                ctx.stroke();
                ctx.closePath();
            }
        };
        Vertexes.prototype.componentDidMount = function () {
            this.update();
        };
        Vertexes.prototype.render = function () {
            return React.createElement("canvas", { ref: "canvas", width: window.innerWidth, height: window.innerHeight / 2, onMouseMove: this.mouseMove, onMouseDown: this.mouseDown });
        };
        return Vertexes;
    }(React.Component));
    Debug.Vertexes = Vertexes;
})(Debug = exports.Debug || (exports.Debug = {}));


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })
/******/ ]);
//# sourceMappingURL=debug.js.map