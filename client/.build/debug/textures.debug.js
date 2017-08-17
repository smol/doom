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
var treeview_1 = require("./treeview");
var graphic_debug_1 = require("./graphic.debug");
var Debug;
(function (Debug) {
    var Textures = (function (_super) {
        __extends(Textures, _super);
        function Textures(props) {
            return _super.call(this, props) || this;
        }
        Textures.prototype.render = function () {
            var items = this.props.texture.getGraphic().map(function (graphic) {
                return { name: graphic.getName(), component: React.createElement(graphic_debug_1.Debug.Graphic, { graphic: graphic }), children: null };
            });
            return React.createElement(treeview_1.Debug.TreeView, { items: items });
        };
        return Textures;
    }(React.Component));
    Debug.Textures = Textures;
})(Debug = exports.Debug || (exports.Debug = {}));
//# sourceMappingURL=textures.debug.js.map