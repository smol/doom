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
//# sourceMappingURL=playpal.debug.js.map