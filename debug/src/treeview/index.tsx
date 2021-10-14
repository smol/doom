import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link } from "react-router-dom";

export interface TreeViewProps {
  items: TreeData[];
}

export interface TreeData {
  label: string;
  url: string;
  children: TreeData[];
}

export class TreeView extends React.Component<
  TreeViewProps,
  { items: [TreeData[]] }
> {
  constructor(props: TreeViewProps) {
    super(props);

    this.state = { items: [this.props.items] };
  }

  private buildTreeView(items: TreeData[], level: number): JSX.Element {
    if (items.length === 0) {
      return null;
    }

    return (
      <ul
        key={`groups${level}`}
        style={{
          margin: 0,
          display: "inline-block",
          verticalAlign: "top",
          height: "100%",
          overflow: "auto",
          width: "15vw",
          padding: "0 10px",
          listStyle: "none",
        }}
      >
        {items.map((item, index) => (
          <li
            key={item.label + index}
            style={{
              padding: "5px",
              borderBottom: "1px solid #cdcdcd",
              background: "#e7e7e7",
              margin: "5px 0",
              borderRadius: "2px",
              transition: "transform .2s ease-in-out",
              cursor: "pointer",
            }}
          >
            <Link to={`/debug/${item.url}/`}>{item.label}</Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { items } = this.state;

    return (
      <div
        style={{
          background: "#616161",
          height: "20vh",
          boxSizing: "border-box",
        }}
      >
        {items.map(this.buildTreeView)}
      </div>
    );
  }
}
