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
var treeview_1 = require("./treeview");
var playpal_debug_1 = require("./playpal.debug");
var graphic_debug_1 = require("./graphic.debug");
var colormap_debug_1 = require("./colormap.debug");
var nodes_debug_1 = require("./nodes.debug");
var endoom_debug_1 = require("./endoom.debug");
var map_debug_1 = require("./map.debug");
var music_debug_1 = require("./music.debug");
var vertexes_debug_1 = require("./vertexes.debug");
var React = require("react");
var ReactDOM = require("react-dom");
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
//# sourceMappingURL=debug.js.map