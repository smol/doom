import { TreeView, TreeData } from "./treeview";
import { Playpal } from "./playpal.debug";
import { ColorMap } from "./colormap.debug";
import { Nodes } from "./nodes.debug";
import { Debug as Subsectors } from "./subsectors.debug";
import { Endoom } from "./endoom.debug";
import { Debug as Map } from "./map.debug";
import { Debug as Music } from "./music.debug";
import { Debug as Vertexes } from "./vertexes.debug";
import { Debug as Wtf } from "./wtf.debug";

import styled from "styled-components";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import * as Wad from "wad";
import * as React from "react";
import treedata from "./actions/treedata";
import { WadContext } from "./contextes";

const Container = styled.div``;

const Viewer = styled.div`
  background: #292929;
  height: 100vh;
  overflow: auto;
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

  // private getMaps(): TreeData[] {
  //   var datas: TreeData[] = [];

  //   datas = this.props.wad.getMaps().map((map) => {
  //     var data: TreeData = {
  //       label: map.getName(),
  //       component: <Map.Map map={map} wad={this.props.wad} />,
  //       children: [],
  //     };

  //     data.children = [
  //       {
  //         label: "THINGS",
  //         component: <Map.Things things={map.getThings()} />,
  //         children: [],
  //       },
  //       {
  //         label: "VERTEXES",
  //         component: (
  //           <Vertexes.Vertexes
  //             vertexes={map.getVertexes()}
  //             linedefs={map.getLinedefs()}
  //           />
  //         ),
  //         children: [],
  //       },
  //       { label: "NODES", component: null, children: this.getNodes(map) },

  //       {
  //         label: "SUBSECTORS",
  //         component: <Subsectors.Subsectors subsectors={map.getSubsectors()} />,
  //         children: [],
  //       },
  //       {
  //         label: "SECTORS",
  //         component: <Wtf.Wtf sectors={map.getSectors()} />,
  //         children: this.getSectors(map),
  //       },
  //     ];

  //     return data;
  //   });

  //   return datas;
  // }

  // private getSectors(map: Wad.Map): TreeData[] {
  //   return map.getSectors().map((sector, index) => {
  //     return {
  //       label: `SECTOR ${index}`,
  //       component: <Wtf.Wtf sectors={[sector]} />,
  //       children: [],
  //     };
  //   });
  // }

  // private getNodes(map: Wad.Map): TreeData[] {
  //   var datas: TreeData[] = [];
  //   var nodes: Wad.Node[] = map.getNodes();

  //   for (var i = 0; i < nodes.length; i++) {
  //     datas.push({
  //       label: "NODE " + i,
  //       component: (
  //         <Nodes.Nodes
  //           vertexes={map.getVertexes()}
  //           linedefs={map.getLinedefs()}
  //           node={nodes[i]}
  //         />
  //       ),
  //       children: [],
  //     });
  //   }

  //   return datas;
  // }

  // private getMusics(): TreeData[] {
  //   var data: TreeData[] = [];

  //   data = this.props.wad.getMusics().map((music) => {
  //     return {
  //       label: music.getName(),
  //       component: <Music.Music music={music} />,
  //       children: [],
  //     };
  //   });

  //   return data;
  // }

  // private getGraphics(): TreeData[] {

  // }

  // private getFlats(): TreeData[] {
  //   var flats: Wad.Flat[] = this.props.wad.getFlats();

  //   return flats.map((flat) => ({
  //     label: flat.getName(),
  //     component: <Graphic.Flat flat={flat} />,
  //     children: null,
  //   }));
  // }

  // private getTextures(): TreeData[] {
  //   var dataTextures: TreeData[] = [];
  //   var textures: Wad.Textures[] = this.props.wad.getTextures();

  //   for (var i = 0; i < textures.length; i++) {
  //     var dataTexture: TreeData = {
  //       label: textures[i].getName(),
  //       component: null,
  //       children: [],
  //     };
  //     var texturesList: Wad.Texture[] = textures[i].getTextures();

  //     for (var j = 0; j < texturesList.length; j++) {
  //       dataTexture.children.push({
  //         label: texturesList[j].getName(),
  //         component: null,
  //         children: null,
  //       });
  //     }

  //     dataTextures.push(dataTexture);
  //   }

  //   return dataTextures;
  //}

  render() {
    const { items } = this.state;
    return (
      <Router>
        <Container>
          <TreeView items={[items]} />
          <Viewer style={{}}>
            <Switch>
              {items.map(({ url, Component }) => (
                <Route key={url} path={`/debug/${url}`}>
                  {Component ? <Component /> : null}
                </Route>
              ))}
            </Switch>
          </Viewer>
        </Container>
      </Router>
    );
  }
}
