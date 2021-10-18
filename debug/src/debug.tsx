import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import styled from "styled-components";
import treedata from "./actions/treedata";
import { WadContext } from "./contextes";
import { TreeData, TreeView } from "./treeview";
import { Viewer } from "./viewer.debug";

const Container = styled.div`
  display: flex;

  /* > .treeview {
    height: 100vh;
    overflow: auto;
  } */
`;

export class Debug extends React.Component<
  {},
  { currentItem: JSX.Element; items: any[] }
> {
  private items: (TreeData & { Component?: () => JSX.Element })[];

  static contextType = WadContext;

  constructor(props) {
    super(props);
    this.state = { currentItem: null, items: [] };
  }

  componentDidMount() {
    console.info(this.context);
    this.setState({ items: treedata(this.context) });
  }

  render() {
    const { items } = this.state;

    return (
      <Router>
        <Switch>
          <Container>
            <Route path="/debug">
              <TreeView items={items} />
            </Route>
            <Route exact path="/">
              <Redirect to="/debug" />
            </Route>

            <Viewer items={items} />
          </Container>
        </Switch>
      </Router>
    );
  }
}
