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
//# sourceMappingURL=colormap.debug.js.map