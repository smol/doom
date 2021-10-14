import { ColorMap } from "../colormap.debug";
import { Endoom } from "../endoom.debug";
import { Playpal } from "../playpal.debug";
import { TreeData } from "../treeview";
import { Graphic } from "../graphic.debug";

export default (wad): (TreeData & { Component?: () => JSX.Element })[] => {
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
    Component: () => <Graphic graphic={graphic} />,
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
      children: [{ label: "GRAPHICS", url: "graphics", children: graphics }],
    },
    { label: "MUSICS", url: "musics", children: [] },
    { label: "MAPS", url: "maps", children: [] },
  ];
};
