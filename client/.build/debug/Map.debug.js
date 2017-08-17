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
var React = require("react");
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
//# sourceMappingURL=map.debug.js.map