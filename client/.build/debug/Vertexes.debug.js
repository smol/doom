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
//# sourceMappingURL=vertexes.debug.js.map