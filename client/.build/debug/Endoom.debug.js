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
//# sourceMappingURL=endoom.debug.js.map