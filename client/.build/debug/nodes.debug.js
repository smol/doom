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
//# sourceMappingURL=nodes.debug.js.map