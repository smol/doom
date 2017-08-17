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
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { items: [_this.props.items] };
            _this.select = _this.select.bind(_this);
            return _this;
        }
        TreeView.prototype.select = function (item, level) {
            if (item.component !== null) {
                console.warn(item.label);
                this.props.select(item.component);
            }
            this.state.items.splice(level + 1, (this.state.items.length - level));
            var items = this.state.items;
            if (item.children !== null && item.children.length > 0) {
                items.push(item.children);
                this.setState({ items: items });
            }
        };
        TreeView.prototype.buildTreeView = function (items, level) {
            var _this = this;
            if (items.length === 0) {
                return null;
            }
            var i = 0;
            var labels = items.map(function (item) {
                return React.createElement("li", { key: item.label + i++, onClick: function () { _this.select(item, level); } }, item.label);
            });
            return React.createElement("ul", { key: "groups" + level, className: "groups " + level }, labels);
        };
        TreeView.prototype.render = function () {
            var _this = this;
            var i = 0;
            var treeviews = this.state.items.map(function (item) {
                return _this.buildTreeView(item, i++);
            });
            return React.createElement("div", { id: "treeview" }, treeviews);
        };
        return TreeView;
    }(React.Component));
    Debug.TreeView = TreeView;
})(Debug = exports.Debug || (exports.Debug = {}));
//# sourceMappingURL=treeview.js.map