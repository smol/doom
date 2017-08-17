declare module Wad {
    class Parser {
        onLoad: () => void;
        private lumps;
        private ident;
        private numlumps;
        private dictpos;
        private data;
        constructor();
        loadFile(filePath: string): void;
        private readFile(blob);
        private lumpExists(name);
        getLumpByName(name: any): any;
        getDataByOffset(offset: number, size: number): any;
        getDataByLump(lump: any): any;
        private getLumpIndexByName(name);
        private getLumpAsText(index);
        private lumpDataToText(data);
        private getLump(index);
        getLumps(): any[];
    }
}
declare var groups: {
    [name: string]: string;
};
declare module Wad {
    class Lump {
        protected lump: any;
        protected data: any;
        protected dataView: DataView;
        protected debugContainer: HTMLElement;
        constructor(lump: any, data: any);
        getName(): string;
    }
}
declare module Wad {
    class Playpal extends Lump {
        private colors;
        constructor(lump: any, data: any);
        getColors(): any[][];
    }
}
declare module Wad {
    class ColorMap extends Lump {
        private playpal;
        private sets;
        private colors;
        constructor(playpal: Playpal, lump: any, data: any);
        getColors(): {
            r: number;
            g: number;
            b: number;
        }[];
        protected onclick(): void;
    }
}
declare var DOS: {
    r: number;
    g: number;
    b: number;
}[];
declare module Wad {
    class Endoom extends Lump {
        private text;
        private buffer;
        private ascii;
        private dosImage;
        constructor(lump: any, data: any);
        private loadAscii(image);
        getData(): Uint8Array;
        private getColor(color);
        private getAscii(code);
        private drawPixel(index, buffer, colors);
    }
}
declare var DoomThingTable: {
    3004: string;
    9: string;
    65: string;
    3001: string;
    3002: string;
    58: string;
    3006: string;
    3005: string;
    69: string;
    3003: string;
    66: string;
    67: string;
    68: string;
    71: string;
    64: string;
    16: string;
    7: string;
    84: string;
    87: string;
    89: string;
    88: string;
    72: string;
    2001: string;
    82: string;
    2002: string;
    2003: string;
    2004: string;
    2005: string;
    2006: string;
    2007: string;
    2048: string;
    2008: string;
    2049: string;
    2010: string;
    2046: string;
    2047: string;
    17: string;
    8: string;
    2011: string;
    2012: string;
    2013: string;
    2014: string;
    2015: string;
    2018: string;
    2019: string;
    2022: string;
    2023: string;
    2024: string;
    2025: string;
    2026: string;
    2045: string;
    83: string;
    13: string;
    6: string;
    5: string;
    38: string;
    39: string;
    40: string;
    1: string;
    2: string;
    3: string;
    4: string;
    11: string;
    14: string;
    10: string;
    12: string;
    15: string;
    18: string;
    19: string;
    20: string;
    21: string;
    22: string;
    23: string;
    24: string;
    25: string;
    26: string;
    27: string;
    28: string;
    29: string;
    49: string;
    50: string;
    51: string;
    52: string;
    53: string;
    59: string;
    60: string;
    61: string;
    62: string;
    63: string;
    30: string;
    31: string;
    32: string;
    33: string;
    34: string;
    35: string;
    36: string;
    37: string;
    41: string;
    42: string;
    43: string;
    44: string;
    45: string;
    46: string;
    47: string;
    48: string;
    54: string;
    55: string;
    56: string;
    57: string;
    2028: string;
    2035: string;
};
declare module Wad {
    class Things extends Lump {
        private things;
        constructor(lump: any, data: any);
        get(): Thing[];
    }
    class Thing {
        private x;
        private y;
        private angle;
        private options;
        typeId: number;
        private type;
        constructor(index: number, dataView: DataView);
        toString(): string;
    }
}
declare module Wad {
    class Vertexes extends Lump {
        private vertexes;
        constructor(lump: any, data: any);
        get(): Vertex[];
    }
    class Vertex extends Lump {
        x: number;
        y: number;
        constructor(lump: any, data: any, offset: number);
    }
}
declare module Wad {
    class Linedefs extends Lump {
        private linedefs;
        constructor(lump: any, data: any);
        get(): Linedef[];
    }
    class Linedef extends Lump {
        private firstVertexIndex;
        private secondVertexIndex;
        private flagsIndex;
        private types;
        private tag;
        private right;
        private left;
        private flags;
        private rightSidedef;
        private leftSidedef;
        constructor(lump: any, data: any, offset: number);
        setSidedef(rightSidedef: Sidedef, leftSidedef: Sidedef): void;
        getRightSidedef(): Sidedef;
        getLeftSidedef(): Sidedef;
        getRight(): number;
        getLeft(): number;
        getFirst(): number;
        getSecond(): number;
        getFlag(): string;
    }
}
declare module Wad {
    class Sector {
        private floorHeight;
        private ceilingHeight;
        private floorTexture;
        private ceilingTexture;
        private lightLevel;
        private specialSector;
        private linedefsTag;
        constructor(offset: number, dataView: DataView);
        getCeilingHeight(): number;
        getFloorHeight(): number;
    }
    class Sectors extends Lump {
        private sectors;
        constructor(lump: any, data: any, sidedefs: Sidedef[]);
        get(): Sector[];
    }
}
declare module Wad {
    class Sidedef {
        private x;
        private y;
        private upper;
        private lower;
        private middle;
        private sector;
        private sectorIndex;
        constructor(offset: number, data: DataView);
        getSectorIndex(): number;
        getSector(): Sector;
        getLower(): string;
        getUpper(): string;
        getMiddle(): string;
        setSector(sector: Sector): void;
    }
    class Sidedefs extends Lump {
        private sidedefs;
        constructor(lump: any, data: any, linedefs: Linedef[]);
        get(): Sidedef[];
    }
}
declare module Wad {
    class Map extends Lump {
        private things;
        private linedefs;
        private vertexes;
        private sectors;
        private nodes;
        private subsectors;
        private segs;
        private sidedefs;
        private rejects;
        constructor(lump: any, data: any);
        setThings(lump: any, data: any): void;
        setLinedefs(lump: any, data: any): void;
        setVertexes(lump: any, data: any): void;
        setSectors(lump: any, data: any): void;
        setNodes(lump: any, data: any): void;
        setReject(lump: any, data: any): void;
        setSidedefs(lump: any, data: any): void;
        setSubsectors(lump: any, data: any): void;
        setSegs(lump: any, data: any): void;
        getLinedefs(): Linedef[];
        getNode(): Node;
        getNodes(): Node[];
        getVertexes(): Vertex[];
        getThings(): Things;
    }
}
declare module Wad {
    class Graphic extends Lump {
        private playpal;
        private width;
        private height;
        private xOffset;
        private yOffset;
        private buffer;
        private imageData;
        constructor(playpal: Playpal, lump: any, data: any, pnames: Pnames);
        getImageData(): Uint8ClampedArray;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module Wad {
    class Wad {
        private playpal;
        private colorMap;
        private endoom;
        private maps;
        private graphics;
        private musics;
        private textures;
        private flats;
        private pnames;
        private flatsStarted;
        constructor();
        setPlaypal(lump: any, data: any): void;
        setColorMap(lump: any, data: any): void;
        setEndoom(lump: any, data: any): void;
        setGraphic(lump: any, data: any): void;
        setPnames(lump: any, data: any): void;
        setFlat(lump: any, data: any): void;
        setMap(lump: any, data: any): void;
        setStartFlats(started: Boolean): void;
        setMusic(lump: any, data: any): void;
        setTextures(parser: Parser, lump: any, data: any): void;
        getPlaypal(): Playpal;
        getColorMap(): ColorMap;
        getEndoom(): Endoom;
        getGraphics(): Graphic[];
        getFlats(): Flat[];
        getMaps(): Map[];
        getTextures(): Textures[];
        getMusics(): Music[];
    }
}
declare module Wad {
    class Type {
        static get(lump: any, data: any, lumps: any[], index: number): string;
    }
}
declare module Wad {
    class TexturePatch {
        x: number;
        y: number;
        pnameIndex: number;
        stepdir: number;
        colormap: number;
        pname: Pname;
    }
    class Texture {
        private dataView;
        private name;
        private width;
        private height;
        private offset;
        private patches;
        constructor(playpal: Playpal, data: any);
        getName(): string;
        getPatches(): TexturePatch[];
        getPnameIndex(): number;
        getSize(): number;
    }
}
declare module Wad {
    class Builder {
        wad: Wad;
        parser: Parser;
        private lumps;
        private unknownTypes;
        constructor(parser: Parser);
        getWad(): Wad;
        go(): void;
        private create(lump, data, index);
    }
}
declare module Wad {
    class MusToMidi {
        private mus_releasekey;
        private mus_presskey;
        private mus_pitchwheel;
        private mus_systemevent;
        private mus_changecontroller;
        private mus_scoreend;
        private midi_releasekey;
        private midi_presskey;
        private midi_aftertouchkey;
        private midi_changecontroller;
        private midi_changepatch;
        private midi_aftertouchchannel;
        private midi_pitchwheel;
        private data;
        private master;
        private dataToWrite;
        private channelvelocities;
        private queuedTime;
        private trackSize;
        private controller_map;
        private channelMap;
        private outputDataView;
        private writePosition;
        private position;
        constructor(data: DataView);
        getMasterOutput(): ArrayBuffer;
        private getMIDIChannel(musChannel);
        private writeData(bytes);
        private writeTime(time);
        private confirmWrite();
        private writeEndTrack();
        private writePitchWheel(channel, wheel);
        private writePressKey(channel, key, velocity);
        private writeReleaseKey(channel, key);
        private readMusHeader();
        private writeChangePatch(channel, patch);
        private writeChangeController_Valued(channel, control, value);
        private writeChangeController_Valueless(channel, control);
        private convert();
    }
}
declare module Wad {
    class Flat extends Lump {
        private buffer;
        constructor(playpal: Playpal, lump: any, data: any);
        getWidth(): number;
        getHeight(): number;
        getImageData(): Uint8Array;
    }
}
declare module Wad {
    class Music extends Lump {
        private buffer;
        constructor(lump: any, data: any);
        getBuffer(): ArrayBuffer;
    }
}
declare module Wad {
    class Node {
        private x;
        private y;
        private dX;
        private dY;
        private rightUpperY;
        private rightLowerY;
        private rightLowerX;
        private rightUpperX;
        private leftUpperY;
        private leftLowerY;
        private leftLowerX;
        private leftUpperX;
        private nodeRightIndex;
        private nodeLeftIndex;
        private nodeRight;
        private nodeLeft;
        private ssectorRight;
        private ssectorLeft;
        constructor(offset: number, dataView: DataView, subsectors: Subsectors);
        setChildren(nodes: Node[]): void;
        getRightBounds(): {
            uX: number;
            uY: number;
            lX: number;
            lY: number;
        };
        getRightNode(): Node;
        getLeftBounds(): {
            uX: number;
            uY: number;
            lX: number;
            lY: number;
        };
        getLeftNode(): Node;
        getRightSubsector(): Subsector;
        getLeftSubsector(): Subsector;
    }
    class Nodes extends Lump {
        private nodes;
        constructor(lump: any, data: any, subsectors: Subsectors);
        getNode(): Node;
        getNodes(): Node[];
    }
}
declare module Wad {
    class Pname {
        private name;
        private graphic;
        constructor(offset: number, data: DataView);
        getName(): string;
        setGraphic(graphic: Graphic): void;
        getGraphics(): Graphic;
    }
    class Pnames extends Lump {
        private pnames;
        constructor(lump: any, data: any, textures: Textures[]);
        setGraphic(graphic: Graphic): void;
        get(): Pname[];
    }
}
declare module Wad {
    class Reject {
        constructor(offset: number, size: number, data: DataView);
    }
    class Rejects extends Lump {
        private rejects;
        constructor(lump: any, data: any, sectors: Sectors);
    }
}
declare module Wad {
    class Seg {
        private startVertex;
        private endVertex;
        private angle;
        private linedef;
        private direction;
        private offset;
        constructor(offset: number, data: DataView, vertices: Vertex[], linedefs: Linedef[]);
        getStartVertex(): Vertex;
        getEndVertex(): Vertex;
        getLinedef(): Linedef;
    }
    class Segs extends Lump {
        private segs;
        constructor(lump: any, data: any, vertices: Vertex[], linedefs: Linedef[]);
        getSeg(index: number): Seg;
    }
}
declare module Wad {
    class Subsector {
        private segsCount;
        private segsOffset;
        private segs;
        constructor(offset: number, data: DataView, segs: Segs);
        getSegs(): Seg[];
    }
    class Subsectors extends Lump {
        private subsectors;
        constructor(lump: any, data: any, segs: Segs);
        getSubsector(index: number): Subsector;
    }
}
declare module Wad {
    class Textures extends Lump {
        private count;
        private offset;
        private textures;
        constructor(parser: Parser, playpal: Playpal, lump: any, data: any);
        setPnames(pnames: string[]): void;
        getTextureByName(name: string): Texture;
        getTextures(): Texture[];
    }
}
