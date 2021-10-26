import { Wad } from "wad";
import { ColorMap } from "../colormap.debug";
import { Endoom } from "../endoom.debug";
import { Flat, Graphic } from "../graphic.debug";
import { Linedefs } from "../linedefs.debug";
import { Map, Things } from "../map.debug";
import { Music } from "../music.debug";
import { Node } from "../nodes.debug";
import { Playpal } from "../playpal.debug";
import { Sector } from "../sector.debug";
import { Subsector } from "../subsector.debug";
import { Texture } from "../texture.debug";
import { TreeData } from "../treeview";
import { Vertexes } from "../vertexes.debug";

export default (wad: Wad): TreeData[] => {
  const graphics = wad
    .getGraphics()
    .sort((a, b) => a.getName().localeCompare(b.getName()))
    .map((graphic) => ({
      label: graphic.getName(),
      url: graphic.getName(),
      Component: () => <Graphic graphic={graphic} />,
      children: null,
    }));

  const textures = wad.getTextures().map<TreeData>((texture) => ({
    label: texture.getName(),
    url: texture.getName(),
    children: texture.getTextures().map((texture) => ({
      label: texture.getName(),
      url: texture.getName(),
      Component: () => <Texture texture={texture} colormaps={wad.ColorMap} />,
      children: [],
    })),
  }));

  const flats = wad.getFlats().map<TreeData>((flat) => ({
    label: flat.getName(),
    url: flat.getName(),
    Component: () => <Flat flat={flat} />,
    children: null,
  }));

  return [
    {
      label: "PLAYPAL",
      url: "playpal",
      children: [],
      Component: () => <Playpal />,
    },
    {
      label: "COLORMAP",
      url: "colormap",
      Component: () => <ColorMap />,
      children: [],
    },
    {
      label: "ENDOOM",
      url: "endoom",
      Component: () => <Endoom />,
      children: [],
    },
    {
      label: "GRAPHICS",
      url: "graphics",
      children: [
        { label: "GRAPHICS", url: "graphics", children: graphics },
        { label: "TEXTURES", url: "textures", children: textures },
        { label: "FLATS", url: "flats", children: flats },
      ],
    },
    {
      label: "MUSICS",
      url: "musics",
      children: wad.getMusics().map((music) => ({
        label: music.getName(),
        url: music.getName(),
        Component: () => <Music music={music} />,
        children: [],
      })),
    },
    {
      label: "MAPS",
      url: "maps",
      children: wad.getMaps().map((map) => ({
        label: map.getName(),
        url: map.getName(),
        Component: () => <Map map={map} wad={wad} />,
        children: [
          {
            label: "LINEDEFS",
            url: "linedefs",
            children: map.getLinedefs().map((linedef, index) => ({
              url: `linedef-${index}`,
              label: `LINEDEF-${index}`,
              children: [],
              Component: () => (
                <Linedefs
                  current={linedef}
                  linedefs={map.getLinedefs()}
                  vertexes={map.getVertexes()}
                />
              ),
            })),
          },
          {
            label: "THINGS",
            url: "things",
            Component: () => <Things things={map.getThings()} />,
            children: [],
          },
          {
            label: "VERTEXES",
            url: "vertexes",
            Component: () => (
              <Vertexes
                vertexes={map.getVertexes()}
                linedefs={map.getLinedefs()}
              />
            ),
            children: [],
          },
          {
            label: "NODES",
            url: "nodes",

            children: map.getNodes().map((node, index) => ({
              label: `NODE-${index}`,
              url: `node-${index}`,
              Component: () => (
                <Node
                  vertexes={map.getVertexes()}
                  linedefs={map.getLinedefs()}
                  node={node}
                />
              ),
              children: [],
            })),
          },

          {
            label: "SUBSECTORS",
            url: "subsectors",

            children: map.getSubsectors().map((subsector, index) => ({
              label: `SUBSECTOR-${index}`,
              url: `subsector-${index}`,
              Component: () => <Subsector subsector={subsector} />,
              children: [],
            })),
          },
          {
            label: "SECTORS",
            url: "sectors",
            children: map.getSectors().map((sector, index) => ({
              label: `SECTOR-${index}`,
              url: `sector-${index}`,
              Component: () => (
                <Sector
                  sector={sector}
                  flats={wad.getFlats()}
                  textures={wad.getTextures()}
                />
              ),
              children: [],
            })),
          },
        ],
      })),
    },
  ];
};

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

//   data = this.props.wad.

//   return data;
// }
