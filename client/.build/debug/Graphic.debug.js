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
//# sourceMappingURL=graphic.debug.js.map