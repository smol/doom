import { ColorMap } from "../colormap.debug";
import { Endoom } from "../endoom.debug";
import { Playpal } from "../playpal.debug";
import { TreeData } from "../treeview";
import { Graphic, Flat } from "../graphic.debug";
import { Music } from "../music.debug";
import { Wad } from "wad";

export default (wad: Wad): TreeData[] => {
  //  var datasGraphics: TreeData[] = [];
  //   var graphics: Wad.Graphic[] = this.props.;

  //   for (var i = 0; i < graphics.length; i++) {
  //     datasGraphics.push({
  //       label: graphics[i].getName(),
  //       component: <Graphic.Graphic graphic={graphics[i]} />,
  //       children: null,
  //     });
  //   }

  //   return [
  //     { label: "GRAPHICS", component: null, children: datasGraphics },
  //     { label: "TEXTURES", component: null, children: this.getTextures() },
  //     { label: "FLATS", component: null, children: this.getFlats() },
  //   ];

  const graphics = wad.getGraphics().map((graphic) => ({
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
    { label: "MAPS", url: "maps", children: [] },
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
