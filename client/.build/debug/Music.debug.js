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
//# sourceMappingURL=music.debug.js.map