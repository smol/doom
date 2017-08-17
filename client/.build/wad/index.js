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
var Wad;
(function (Wad) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.prototype.loadFile = function (filePath) {
            console.warn('Load WAD FILE', filePath);
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (xhr.status == 200) {
                    self.readFile(xhr.response);
                }
            };
            xhr.send(null);
        };
        Parser.prototype.readFile = function (blob) {
            var self = this;
            this.lumps = [];
            var offset = 0;
            var chunkSize = 1;
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = function (e) {
                var result = e.target.result;
                self.data = result;
                var headerReader = new DataView(result);
                self.ident = '';
                for (var i = 0; i < 4; i++) {
                    self.ident += String.fromCharCode(headerReader.getUint8(i));
                }
                if (self.ident != "IWAD" && self.ident != "PWAD") {
                }
                else {
                    self.numlumps = headerReader.getInt32(4, true);
                    self.dictpos = headerReader.getInt32(8, true);
                    offset = self.dictpos;
                    chunkSize = 128;
                    chunkReaderBlock(self.dictpos, chunkSize, blob);
                }
            };
            var nextChunk = function (e) {
                offset += e.target.result.byteLength;
                var dataReader = new DataView(e.target.result);
                for (var i = 0; i < dataReader.byteLength / 16; i++) {
                    var p = i * 16;
                    var lumpPos = dataReader.getInt32(p, true);
                    var lumpSize = dataReader.getInt32(p + 4, true);
                    var lumpName = "";
                    for (var j = p + 8; j < p + 16; j++) {
                        if (dataReader.getUint8(j) != 0) {
                            lumpName += String.fromCharCode(dataReader.getUint8(j));
                        }
                    }
                    var lumpEntry = {
                        pos: lumpPos,
                        size: lumpSize,
                        name: lumpName
                    };
                    self.lumps.push(lumpEntry);
                }
                if (offset >= blob.size) {
                    self.onLoad();
                    return;
                }
                chunkReaderBlock(offset, chunkSize, blob);
            };
            var chunkReaderBlock = function (offset, chunkSize, data) {
                var r = new FileReader();
                var b = data.slice(offset, offset + chunkSize);
                r.onload = nextChunk;
                r.readAsArrayBuffer(b);
            };
        };
        Parser.prototype.lumpExists = function (name) {
            for (var i = 0; i < this.numlumps; i++) {
                if (this.lumps[i].name == name) {
                    return true;
                }
            }
            return false;
        };
        Parser.prototype.getLumpByName = function (name) {
            for (var i = 0; i < this.numlumps; i++) {
                if (this.lumps[i].name == name) {
                    var l = this.lumps[i];
                    return this.data.slice(l.pos, l.pos + l.size);
                }
            }
            return null;
        };
        Parser.prototype.getDataByOffset = function (offset, size) {
            return this.data.slice(offset, offset + size);
        };
        Parser.prototype.getDataByLump = function (lump) {
            return this.data.slice(lump.pos, lump.pos + lump.size);
        };
        Parser.prototype.getLumpIndexByName = function (name) {
            for (var i = this.numlumps - 1; i >= 0; i--) {
                if (this.lumps[i].name == name) {
                    return i;
                }
            }
            return null;
        };
        Parser.prototype.getLumpAsText = function (index) {
            var dat = this.getLump(index);
            return this.lumpDataToText(dat);
        };
        Parser.prototype.lumpDataToText = function (data) {
            var output = "";
            var dv = new DataView(data);
            for (var i = 0; i < data.byteLength; i++)
                output += String.fromCharCode(dv.getUint8(i));
            return output;
        };
        Parser.prototype.getLump = function (index) {
            var l = this.lumps[index];
            return this.data.slice(l.pos, l.pos + l.size);
        };
        Parser.prototype.getLumps = function () {
            return this.lumps;
        };
        return Parser;
    }());
    Wad.Parser = Parser;
})(Wad || (Wad = {}));
var groups = {
    'D_.*': 'D_s',
    'E\\dM\\d': 'ExMx',
    'DEMO\\d': 'Demos',
    'END\\d': 'ENDs',
    'AMMNUM\\d': 'AMMNUMs',
    'STG.*': 'STGs',
    'STT.*': 'STTs',
    'WIA\\d': 'WIAs',
    'STCFN\\d': 'STCFNs',
    'STKEYS\\d': 'STKEYs',
    'DP.*': 'DPs',
    'DS.*': 'DSs',
};
var Wad;
(function (Wad) {
    var Lump = (function () {
        function Lump(lump, data) {
            this.lump = lump;
            this.data = data;
            this.dataView = new DataView(this.data);
        }
        Lump.prototype.getName = function () {
            if (this.lump === null)
                return "NOTHING";
            return this.lump.name;
        };
        return Lump;
    }());
    Wad.Lump = Lump;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Playpal = (function (_super) {
        __extends(Playpal, _super);
        function Playpal(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.colors = [];
            for (var n = 0; n < 14; n++) {
                var temp = [];
                for (var i = 0; i < 256; i++) {
                    var r = _this.dataView.getUint8((n * 768) + (i * 3) + 0);
                    var g = _this.dataView.getUint8((n * 768) + (i * 3) + 1);
                    var b = _this.dataView.getUint8((n * 768) + (i * 3) + 2);
                    temp.push({ r: r, g: g, b: b });
                }
                _this.colors.push(temp);
            }
            return _this;
        }
        Playpal.prototype.getColors = function () {
            return this.colors;
        };
        return Playpal;
    }(Wad.Lump));
    Wad.Playpal = Playpal;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var ColorMap = (function (_super) {
        __extends(ColorMap, _super);
        function ColorMap(playpal, lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.playpal = playpal;
            _this.sets = [];
            _this.colors = [];
            var colors = _this.playpal.getColors()[0];
            for (var i = 0; i < 34; i++) {
                var temp = [];
                for (var b = 0; b < 256; b++) {
                    var byte = _this.dataView.getUint8((i * 256) + b);
                    temp.push(byte);
                    _this.colors.push(colors[byte]);
                }
                _this.sets.push({ index: 0, brightness: temp });
            }
            return _this;
        }
        ColorMap.prototype.getColors = function () {
            return this.colors;
        };
        ColorMap.prototype.onclick = function () {
        };
        return ColorMap;
    }(Wad.Lump));
    Wad.ColorMap = ColorMap;
})(Wad || (Wad = {}));
var DOS = [
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 128 },
    { r: 0, g: 128, b: 0 },
    { r: 0, g: 128, b: 128 },
    { r: 128, g: 0, b: 0 },
    { r: 128, g: 0, b: 128 },
    { r: 128, g: 128, b: 0 },
    { r: 192, g: 192, b: 192 },
    { r: 128, g: 128, b: 128 },
    { r: 0, g: 0, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 0, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 255, b: 255 }
];
var Wad;
(function (Wad) {
    var Endoom = (function (_super) {
        __extends(Endoom, _super);
        function Endoom(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            var self = _this;
            _this.text = [];
            _this.buffer = new Uint8Array(640 * 400 * 4);
            _this.dosImage = new Image();
            _this.dosImage.src = '/client/assets/dos.png';
            _this.dosImage.onload = function () {
                self.loadAscii(this);
                for (var i = 0; i < 2000; i++) {
                    var char = self.dataView.getUint8(i * 2);
                    var color = self.dataView.getUint8(i * 2 + 1);
                    self.text.push(char);
                    var fb = self.getColor(color);
                    self.buffer = self.drawPixel(i, self.buffer, fb);
                }
            };
            return _this;
        }
        Endoom.prototype.loadAscii = function (image) {
            var canvas = document.createElement('canvas');
            canvas.className = 'debug-container endoom';
            canvas.width = 256;
            canvas.height = 128;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            var imageData = ctx.getImageData(0, 0, 256, 128);
            this.ascii = imageData.data;
        };
        Endoom.prototype.getData = function () { return this.buffer; };
        Endoom.prototype.getColor = function (color) {
            var foreground = color & parseInt('00001111', 2);
            var background = (color >> 4);
            var blink = false;
            if (background >= 8) {
                blink = true;
                background -= 8;
            }
            return { f: DOS[foreground], b: blink ? DOS[0] : DOS[background] };
        };
        Endoom.prototype.getAscii = function (code) {
            var buffer = new Uint8ClampedArray(8 * 16 * 4);
            var startX = Math.round(code % 32) * 8;
            var startY = Math.floor(code / 32) * 16;
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 16; y++) {
                    var pox = startX + x;
                    var poy = startY + y;
                    buffer[(x + (y * 8)) * 4 + 0] = this.ascii[(pox + (poy * 256)) * 4 + 0];
                    buffer[(x + (y * 8)) * 4 + 1] = this.ascii[(pox + (poy * 256)) * 4 + 1];
                    buffer[(x + (y * 8)) * 4 + 2] = this.ascii[(pox + (poy * 256)) * 4 + 2];
                    buffer[(x + (y * 8)) * 4 + 3] = this.ascii[(pox + (poy * 256)) * 4 + 3];
                }
            }
            return buffer;
        };
        Endoom.prototype.drawPixel = function (index, buffer, colors) {
            var startX = Math.round(index % 80) * 8;
            var startY = Math.floor(index / 80) * 16;
            var code = this.text[index];
            var asciiBuffer = this.getAscii(code);
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 16; y++) {
                    var pox = startX + x;
                    var poy = startY + y;
                    var pos = 4 * ((poy * 640) + pox);
                    var ascii = (x + (y * 8)) * 4;
                    buffer[pos + 0] = asciiBuffer[ascii + 0] ? colors.f.r : colors.b.r;
                    buffer[pos + 1] = asciiBuffer[ascii + 1] ? colors.f.g : colors.b.g;
                    buffer[pos + 2] = asciiBuffer[ascii + 2] ? colors.f.b : colors.b.b;
                    buffer[pos + 3] = asciiBuffer[ascii + 3] ? 255 : 255;
                }
            }
            return buffer;
        };
        return Endoom;
    }(Wad.Lump));
    Wad.Endoom = Endoom;
})(Wad || (Wad = {}));
var DoomThingTable = {
    3004: "zombie",
    9: "sergeant",
    65: "commando",
    3001: "imp",
    3002: "demon",
    58: "spectre",
    3006: "lost soul",
    3005: "cacodemon",
    69: "hell knight",
    3003: "baron of hell",
    66: "revenant",
    67: "mancubus",
    68: "arachnotron",
    71: "pain elemental",
    64: "archvile",
    16: "cyberdemon",
    7: "spider mastermind",
    84: "ss guy",
    87: "spawn target",
    89: "spawn shooter",
    88: "romero head",
    72: "commander keen",
    2001: "shotgun",
    82: "super shotgun",
    2002: "chaingun",
    2003: "rocket launcher",
    2004: "plasma gun",
    2005: "chainsaw",
    2006: "bfg 9000",
    2007: "ammo clip",
    2048: "ammo box",
    2008: "shells",
    2049: "shell box",
    2010: "rocket",
    2046: "rocket box",
    2047: "cell charge",
    17: "cell pack",
    8: "backpack",
    2011: "stimpack",
    2012: "medikit",
    2013: "supercharge",
    2014: "health bonus",
    2015: "armor bonus",
    2018: "green armor",
    2019: "blue armor",
    2022: "invulnerability",
    2023: "berserk",
    2024: "invisibility",
    2025: "radiation suit",
    2026: "computer map",
    2045: "goggles",
    83: "megasphere",
    13: "red keycard",
    6: "yellow keycard",
    5: "blue keycard",
    38: "red skull key",
    39: "yellow skull key",
    40: "blue skull key",
    1: "player 1 start",
    2: "player 2 start",
    3: "player 3 start",
    4: "player 4 start",
    11: "deathmatch start",
    14: "teleport destination",
    10: "gibs 1",
    12: "gibs 2",
    15: "dead marine",
    18: "dead zombie",
    19: "dead sergeant",
    20: "dead imp",
    21: "dead demon",
    22: "dead cacodemon",
    23: "dead lost soul",
    24: "pool of blood",
    25: "impaled human 1",
    26: "impaled human 2",
    27: "skull on pole",
    28: "five skulls",
    29: "skull pile",
    49: "hangman 1",
    50: "hangman 2",
    51: "hangman 3",
    52: "hangman 4",
    53: "hangman 5",
    59: "hangman 2 (passable)",
    60: "hangman 4 (passable)",
    61: "hangman 3 (passable)",
    62: "hangman 5 (passable)",
    63: "hangman 1 (passable)",
    30: "green pillar",
    31: "short green pillar",
    32: "red pillar",
    33: "short red pillar",
    34: "candle",
    35: "candelabra",
    36: "green pillar with heart",
    37: "red pillar with skull",
    41: "eye",
    42: "skull rock",
    43: "gray tree",
    44: "blue torch",
    45: "green torch",
    46: "red torch",
    47: "scrub",
    48: "tech column",
    54: "brown tree",
    55: "short blue torch",
    56: "short green torch",
    57: "short red torch",
    2028: "floor lamp",
    2035: "barrel"
};
var Wad;
(function (Wad) {
    var Things = (function (_super) {
        __extends(Things, _super);
        function Things(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.things = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 10) {
                _this.things.push(new Thing(i, _this.dataView));
            }
            return _this;
        }
        Things.prototype.get = function () {
            return this.things;
        };
        return Things;
    }(Wad.Lump));
    Wad.Things = Things;
    var Thing = (function () {
        function Thing(index, dataView) {
            this.x = dataView.getInt16(index, true);
            this.y = dataView.getInt16(index + 2, true);
            this.angle = dataView.getInt16(index + 4, true);
            this.typeId = dataView.getInt16(index + 6, true);
            this.options = dataView.getInt16(index + 8, true);
            this.type = DoomThingTable[this.typeId];
        }
        Thing.prototype.toString = function () {
            return 'type: ' + this.type + ' x: ' + this.x + ' y: ' + this.y + ' angle: ' + this.angle + ' options: ' + this.options;
        };
        return Thing;
    }());
    Wad.Thing = Thing;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Vertexes = (function (_super) {
        __extends(Vertexes, _super);
        function Vertexes(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.vertexes = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 4) {
                _this.vertexes.push(new Vertex(lump, data, i));
            }
            return _this;
        }
        Vertexes.prototype.get = function () {
            return this.vertexes;
        };
        return Vertexes;
    }(Wad.Lump));
    Wad.Vertexes = Vertexes;
    var Vertex = (function (_super) {
        __extends(Vertex, _super);
        function Vertex(lump, data, offset) {
            var _this = _super.call(this, lump, data) || this;
            _this.x = _this.dataView.getInt16(offset, true);
            _this.y = _this.dataView.getInt16(offset + 2, true);
            return _this;
        }
        return Vertex;
    }(Wad.Lump));
    Wad.Vertex = Vertex;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var flagsType = [
        'Impassible',
        'Block Monster',
        'Two-Sided',
        'Upper Unpegged',
        'Lower Unpegged',
        'Secret',
        'Block Sound',
        'Not on map',
        'Already on map'
    ];
    var Linedefs = (function (_super) {
        __extends(Linedefs, _super);
        function Linedefs(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.linedefs = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 14) {
                _this.linedefs.push(new Linedef(lump, data, i));
            }
            return _this;
        }
        Linedefs.prototype.get = function () {
            return this.linedefs;
        };
        return Linedefs;
    }(Wad.Lump));
    Wad.Linedefs = Linedefs;
    var Linedef = (function (_super) {
        __extends(Linedef, _super);
        function Linedef(lump, data, offset) {
            var _this = _super.call(this, lump, data) || this;
            _this.firstVertexIndex = _this.dataView.getInt16(offset, true);
            _this.secondVertexIndex = _this.dataView.getInt16(offset + 2, true);
            _this.flagsIndex = _this.dataView.getInt16(offset + 4, true);
            _this.types = _this.dataView.getInt16(offset + 6, true);
            _this.tag = _this.dataView.getInt16(offset + 8, true);
            _this.right = _this.dataView.getInt16(offset + 10, true);
            _this.left = _this.dataView.getInt16(offset + 12, true);
            _this.flags = 'NOTHING';
            if (_this.flagsIndex < flagsType.length) {
                _this.flags = flagsType[_this.flagsIndex];
            }
            return _this;
        }
        Linedef.prototype.setSidedef = function (rightSidedef, leftSidedef) {
            this.rightSidedef = rightSidedef;
            this.leftSidedef = leftSidedef;
        };
        Linedef.prototype.getRightSidedef = function () {
            return this.rightSidedef;
        };
        Linedef.prototype.getLeftSidedef = function () {
            return this.leftSidedef;
        };
        Linedef.prototype.getRight = function () {
            return this.right;
        };
        Linedef.prototype.getLeft = function () {
            return this.left;
        };
        Linedef.prototype.getFirst = function () {
            return this.firstVertexIndex;
        };
        Linedef.prototype.getSecond = function () {
            return this.secondVertexIndex;
        };
        Linedef.prototype.getFlag = function () {
            return this.flags;
        };
        return Linedef;
    }(Wad.Lump));
    Wad.Linedef = Linedef;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Sector = (function () {
        function Sector(offset, dataView) {
            this.floorHeight = dataView.getInt16(0 + offset, true);
            this.ceilingHeight = dataView.getInt16(2 + offset, true);
            this.floorTexture = "";
            this.ceilingTexture = "";
            for (var i = 0; i < 8; i++) {
                this.floorTexture += String.fromCharCode(dataView.getUint8(i + 4 + offset));
                this.ceilingTexture += String.fromCharCode(dataView.getUint8(i + 12 + offset));
            }
            this.lightLevel = dataView.getInt16(20 + offset, true);
            this.specialSector = dataView.getInt16(22 + offset, true);
            this.linedefsTag = dataView.getInt16(24 + offset, true);
        }
        Sector.prototype.getCeilingHeight = function () {
            return this.ceilingHeight;
        };
        Sector.prototype.getFloorHeight = function () {
            return this.floorHeight;
        };
        return Sector;
    }());
    Wad.Sector = Sector;
    var Sectors = (function (_super) {
        __extends(Sectors, _super);
        function Sectors(lump, data, sidedefs) {
            var _this = _super.call(this, lump, data) || this;
            _this.sectors = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 26) {
                var sector = new Sector(i, _this.dataView);
                _this.sectors.push(sector);
            }
            for (var i = 0; i < sidedefs.length; i++) {
                sidedefs[i].setSector(_this.sectors[sidedefs[i].getSectorIndex()]);
            }
            return _this;
        }
        Sectors.prototype.get = function () {
            return this.sectors;
        };
        return Sectors;
    }(Wad.Lump));
    Wad.Sectors = Sectors;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Sidedef = (function () {
        function Sidedef(offset, data) {
            this.x = data.getInt16(offset + 0, true);
            this.y = data.getInt16(offset + 2, true);
            this.upper = "";
            this.lower = "";
            this.middle = "";
            var i = 4;
            for (i = 4; i < 12; i++) {
                var charcode = data.getUint8(offset + i);
                if (charcode == 0)
                    break;
                this.upper += String.fromCharCode(charcode);
            }
            for (i = 12; i < 20; i++) {
                var charcode = data.getUint8(offset + i);
                if (charcode == 0)
                    break;
                this.lower += String.fromCharCode(charcode);
            }
            for (i = 20; i < 28; i++) {
                var charcode = data.getUint8(offset + i);
                if (charcode == 0)
                    break;
                this.middle += String.fromCharCode(charcode);
            }
            this.sectorIndex = data.getInt16(offset + 28, true);
        }
        Sidedef.prototype.getSectorIndex = function () {
            return this.sectorIndex;
        };
        Sidedef.prototype.getSector = function () {
            return this.sector;
        };
        Sidedef.prototype.getLower = function () {
            return this.lower;
        };
        Sidedef.prototype.getUpper = function () {
            return this.upper;
        };
        Sidedef.prototype.getMiddle = function () {
            return this.middle;
        };
        Sidedef.prototype.setSector = function (sector) {
            this.sector = sector;
        };
        return Sidedef;
    }());
    Wad.Sidedef = Sidedef;
    var Sidedefs = (function (_super) {
        __extends(Sidedefs, _super);
        function Sidedefs(lump, data, linedefs) {
            var _this = _super.call(this, lump, data) || this;
            _this.sidedefs = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 30) {
                var sidedef = new Sidedef(i, _this.dataView);
                _this.sidedefs.push(sidedef);
            }
            for (var i = 0; i < linedefs.length; i++) {
                var rightIndex = linedefs[i].getRight();
                var leftIndex = linedefs[i].getLeft();
                linedefs[i].setSidedef(_this.sidedefs[rightIndex], _this.sidedefs[leftIndex]);
            }
            return _this;
        }
        Sidedefs.prototype.get = function () {
            return this.sidedefs;
        };
        return Sidedefs;
    }(Wad.Lump));
    Wad.Sidedefs = Sidedefs;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map(lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.things = null;
            _this.linedefs = null;
            _this.vertexes = null;
            _this.sectors = null;
            _this.rejects = null;
            return _this;
        }
        Map.prototype.setThings = function (lump, data) {
            this.things = new Wad.Things(lump, data);
        };
        Map.prototype.setLinedefs = function (lump, data) {
            this.linedefs = new Wad.Linedefs(lump, data);
        };
        Map.prototype.setVertexes = function (lump, data) {
            this.vertexes = new Wad.Vertexes(lump, data);
        };
        Map.prototype.setSectors = function (lump, data) {
            this.sectors = new Wad.Sectors(lump, data, this.sidedefs.get());
        };
        Map.prototype.setNodes = function (lump, data) {
            this.nodes = new Wad.Nodes(lump, data, this.subsectors);
        };
        Map.prototype.setReject = function (lump, data) {
            this.rejects = new Wad.Rejects(lump, data, this.sectors);
        };
        Map.prototype.setSidedefs = function (lump, data) {
            this.sidedefs = new Wad.Sidedefs(lump, data, this.linedefs.get());
        };
        Map.prototype.setSubsectors = function (lump, data) {
            this.subsectors = new Wad.Subsectors(lump, data, this.segs);
        };
        Map.prototype.setSegs = function (lump, data) {
            this.segs = new Wad.Segs(lump, data, this.vertexes.get(), this.linedefs.get());
        };
        Map.prototype.getLinedefs = function () {
            return this.linedefs.get();
        };
        Map.prototype.getNode = function () {
            return this.nodes.getNode();
        };
        Map.prototype.getNodes = function () {
            return this.nodes.getNodes();
        };
        Map.prototype.getVertexes = function () {
            return this.vertexes.get();
        };
        Map.prototype.getThings = function () { return this.things; };
        return Map;
    }(Wad.Lump));
    Wad.Map = Map;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Graphic = (function (_super) {
        __extends(Graphic, _super);
        function Graphic(playpal, lump, data, pnames) {
            var _this = _super.call(this, lump, data) || this;
            pnames.setGraphic(_this);
            _this.playpal = playpal;
            _this.width = _this.dataView.getUint16(0, true);
            _this.height = _this.dataView.getUint16(2, true);
            _this.xOffset = _this.dataView.getUint16(4, true);
            _this.yOffset = _this.dataView.getUint16(6, true);
            var columns = [];
            for (var i = 0; i < _this.width; i++) {
                columns.push(_this.dataView.getUint32(8 + (i * 4), true));
            }
            _this.buffer = new Uint8ClampedArray(_this.width * _this.height);
            _this.imageData = new Uint8ClampedArray(_this.width * _this.height * 4);
            for (var i = 0; i < (_this.width * _this.height); i++) {
                _this.buffer[i] = -1;
            }
            var position = 0;
            for (var i = 0; i < _this.width; i++) {
                position = columns[i];
                var rowStart = 0;
                while (rowStart != 255) {
                    rowStart = _this.dataView.getUint8(position);
                    position += 1;
                    if (rowStart == 255) {
                        break;
                    }
                    var pixelsNumber = _this.dataView.getUint8(position);
                    position += 1;
                    var dummyValue = _this.dataView.getUint8(position);
                    position++;
                    for (var j = 0; j < pixelsNumber; j++) {
                        _this.buffer[((rowStart + j) * _this.width) + i] = _this.dataView.getUint8(position);
                        position++;
                    }
                    _this.dataView.getUint8(position);
                    position++;
                }
            }
            for (var i = 0; i < _this.buffer.length; i++) {
                if (_this.buffer[i] !== -1) {
                    var color = _this.playpal.getColors()[0][_this.buffer[i]];
                    _this.imageData[i * 4 + 0] = color.r;
                    _this.imageData[i * 4 + 1] = color.g;
                    _this.imageData[i * 4 + 2] = color.b;
                    _this.imageData[i * 4 + 3] = 255;
                }
                else {
                    _this.imageData[i * 4 + 0] = 255;
                    _this.imageData[i * 4 + 1] = 0;
                    _this.imageData[i * 4 + 2] = 0;
                    _this.imageData[i * 4 + 3] = 0;
                }
            }
            return _this;
        }
        Graphic.prototype.getImageData = function () {
            return this.imageData;
        };
        Graphic.prototype.getWidth = function () { return this.width; };
        Graphic.prototype.getHeight = function () { return this.height; };
        return Graphic;
    }(Wad.Lump));
    Wad.Graphic = Graphic;
})(Wad || (Wad = {}));
var Wad;
(function (Wad_1) {
    var Wad = (function () {
        function Wad() {
            this.flatsStarted = false;
            this.graphics = [];
            this.maps = [];
            this.flats = [];
            this.textures = [];
            this.musics = [];
        }
        Wad.prototype.setPlaypal = function (lump, data) {
            this.playpal = new Wad_1.Playpal(lump, data);
        };
        Wad.prototype.setColorMap = function (lump, data) {
            this.colorMap = new Wad_1.ColorMap(this.playpal, lump, data);
        };
        Wad.prototype.setEndoom = function (lump, data) {
            this.endoom = new Wad_1.Endoom(lump, data);
        };
        Wad.prototype.setGraphic = function (lump, data) {
            var graphic = new Wad_1.Graphic(this.playpal, lump, data, this.pnames);
            this.graphics.push(graphic);
        };
        Wad.prototype.setPnames = function (lump, data) {
            this.pnames = new Wad_1.Pnames(lump, data, this.textures);
        };
        Wad.prototype.setFlat = function (lump, data) {
            if (this.flatsStarted)
                this.flats.push(new Wad_1.Flat(this.playpal, lump, data));
        };
        Wad.prototype.setMap = function (lump, data) {
            this.maps.push(new Wad_1.Map(lump, data));
        };
        Wad.prototype.setStartFlats = function (started) {
            this.flatsStarted = started;
        };
        Wad.prototype.setMusic = function (lump, data) {
            this.musics.push(new Wad_1.Music(lump, data));
        };
        Wad.prototype.setTextures = function (parser, lump, data) {
            var textures = new Wad_1.Textures(parser, this.playpal, lump, data);
            this.textures.push(textures);
        };
        Wad.prototype.getPlaypal = function () { return this.playpal; };
        Wad.prototype.getColorMap = function () { return this.colorMap; };
        Wad.prototype.getEndoom = function () { return this.endoom; };
        Wad.prototype.getGraphics = function () { return this.graphics; };
        Wad.prototype.getFlats = function () { return this.flats; };
        Wad.prototype.getMaps = function () { return this.maps; };
        Wad.prototype.getTextures = function () { return this.textures; };
        Wad.prototype.getMusics = function () { return this.musics; };
        return Wad;
    }());
    Wad_1.Wad = Wad;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Type = (function () {
        function Type() {
        }
        Type.get = function (lump, data, lumps, index) {
            function headerCheck(dataView, header) {
                var chrs = header.split("");
                for (var i = 0; i < header.length; i++) {
                    if (header.charCodeAt(i) != dataView.getUint8(i))
                        return false;
                }
                return true;
            }
            if (lump.size != 0) {
                var dv = new DataView(data);
                if (headerCheck(dv, 'MThd'))
                    return "MIDI";
                if (headerCheck(dv, 'ID3'))
                    return "MP3";
                if (headerCheck(dv, 'MUS'))
                    return "MUSIC";
                if (headerCheck(dv, String.fromCharCode(137) + 'PNG'))
                    return "PNG";
            }
            var name = lump.name;
            if ("TEXTLUMPS".indexOf(name) >= 0)
                return "TEXT";
            if ("MAPLUMPS".indexOf(name) >= 0)
                return "MAPDATA";
            if ("DATA_LUMPS".indexOf(name) >= 0)
                return name;
            if (/^MAP\d\d/.test(name))
                return "MAP";
            if (/^E\dM\d/.test(name))
                return "MAP";
            if (/_START$/.test(name))
                return "MARKER";
            if (/_END$/.test(name))
                return "MARKER";
            if (lump.size == 0)
                return "MARKER";
            for (var i = index; i >= 0; i--) {
                if (/_END$/.test(lumps[i].name))
                    break;
                if (/_START$/.test(lumps[i].name)) {
                    var pre = lumps[i].name.substr(0, lumps[i].name.indexOf("_") + 1);
                    if ("GRAPHIC_MARKER".indexOf(pre) >= 0)
                        return "GRAPHIC";
                    if ("FLAT_MARKERS".indexOf(pre) >= 0)
                        return "FLAT";
                }
            }
            if (/^D_/.test(name))
                return "MUSIC";
            function isDoomGFX(dv, lump) {
                if (dv.getUint16(0, true) > 4096)
                    return false;
                if (dv.getUint16(2, true) > 4096)
                    return false;
                if (dv.getInt16(4, true) > 2000 || dv.getInt16(4, true) < -2000)
                    return false;
                if (dv.getInt16(6, true) > 2000 || dv.getInt16(6, true) < -2000)
                    return false;
                if (dv.getUint8(lump.size - 1) != 0xFF) {
                    var found = false;
                    for (var b = 1; b <= 4; b++) {
                        if (found == false) {
                            if (dv.getUint8(lump.size - b) == 0xFF) {
                                found = true;
                            }
                            else if (dv.getUint8(lump.size - b) != 0x00) {
                                return false;
                            }
                        }
                    }
                    if (found == false)
                        return false;
                }
                return true;
            }
            function isFlat(dv, lump) {
                return lump.size == 4096;
            }
            if (isDoomGFX(dv, lump))
                return "GRAPHIC";
            if (isFlat(dv, lump))
                return "FLAT";
            return "";
        };
        return Type;
    }());
    Wad.Type = Type;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var TexturePatch = (function () {
        function TexturePatch() {
        }
        return TexturePatch;
    }());
    Wad.TexturePatch = TexturePatch;
    var Texture = (function () {
        function Texture(playpal, data) {
            this.offset = 0;
            this.dataView = new DataView(data);
            this.name = "";
            for (; this.offset < 8; this.offset++) {
                var charcode = this.dataView.getUint8(this.offset);
                if (charcode == 0)
                    break;
                this.name += String.fromCharCode(charcode);
            }
            this.offset = 8;
            this.offset += 2;
            this.offset += 2;
            this.width = this.dataView.getUint8(this.offset);
            this.offset += 2;
            this.height = this.dataView.getUint8(this.offset);
            this.offset += 2;
            this.offset += 2;
            this.offset += 2;
            var patchCount = this.dataView.getInt8(this.offset);
            this.offset += 2;
            this.patches = [];
            for (var i = 0; i < patchCount; i++) {
                var x = this.dataView.getUint8(this.offset);
                this.offset += 2;
                var y = this.dataView.getUint8(this.offset);
                this.offset += 2;
                var index = this.dataView.getUint8(this.offset);
                this.offset += 2;
                var stepdir = this.dataView.getUint8(this.offset);
                this.offset += 2;
                var colormap = this.dataView.getUint8(this.offset);
                this.offset += 2;
                this.patches.push({ x: x, y: y, pnameIndex: index, stepdir: stepdir, colormap: colormap, pname: null });
            }
        }
        Texture.prototype.getName = function () {
            return this.name;
        };
        Texture.prototype.getPatches = function () {
            return this.patches;
        };
        Texture.prototype.getPnameIndex = function () {
            return 0;
        };
        Texture.prototype.getSize = function () {
            return this.offset;
        };
        return Texture;
    }());
    Wad.Texture = Texture;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var FUNCS = [
        { name: 'PLAYPAL', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setPlaypal(lump, data); } },
        { name: 'COLORMAP', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setColorMap(lump, data); } },
        { name: 'ENDOOM', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setEndoom(lump, data); } },
        { name: null, type: null, regex: /^E\dM\d$/, action: function (builder, lump, data) { builder.wad.setMap(lump, data); } },
        { name: 'THINGS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setThings(lump, data); } },
        { name: 'LINEDEFS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setLinedefs(lump, data); } },
        { name: 'VERTEXES', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setVertexes(lump, data); } },
        { name: 'NODES', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setNodes(lump, data); } },
        { name: 'SEGS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setSegs(lump, data); } },
        { name: 'SECTORS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setSectors(lump, data); } },
        { name: 'SIDEDEFS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setSidedefs(lump, data); } },
        { name: 'SSECTORS', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setSubsectors(lump, data); } },
        { name: 'REJECT', type: null, regex: null, action: function (builder, lump, data) { var maps = builder.wad.getMaps(); maps[maps.length - 1].setReject(lump, data); } },
        { name: null, type: null, regex: /^TEXTURE\d$/, action: function (builder, lump, data) { builder.wad.setTextures(builder.parser, lump, data); } },
        { name: 'F_START', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setStartFlats(true); } },
        { name: 'F_END', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setStartFlats(false); } },
        { name: null, type: 'FLAT', regex: null, action: function (builder, lump, data) { builder.wad.setFlat(lump, data); } },
        { name: null, type: 'GRAPHIC', regex: null, action: function (builder, lump, data) { builder.wad.setGraphic(lump, data); } },
        { name: null, type: 'MUSIC', regex: null, action: function (builder, lump, data) { builder.wad.setMusic(lump, data); } },
        { name: 'PNAMES', type: null, regex: null, action: function (builder, lump, data) { builder.wad.setPnames(lump, data); } },
    ];
    var Builder = (function () {
        function Builder(parser) {
            this.parser = parser;
            this.wad = new Wad.Wad();
            this.unknownTypes = [];
        }
        Builder.prototype.getWad = function () {
            return this.wad;
        };
        Builder.prototype.go = function () {
            this.lumps = this.parser.getLumps();
            this.unknownTypes = [];
            for (var i = 0; i < this.lumps.length; i++) {
                var data = this.parser.getDataByLump(this.lumps[i]);
                this.create(this.lumps[i], data, i);
            }
            console.info('WAD', this.wad);
            console.info('UNKNOWN TYPES', this.unknownTypes);
        };
        Builder.prototype.create = function (lump, data, index) {
            var type = Wad.Type.get(lump, data, this.lumps, index);
            for (var i = 0; i < FUNCS.length; i++) {
                if (FUNCS[i].name === lump.name || FUNCS[i].type === type ||
                    (FUNCS[i].regex != null && FUNCS[i].regex.test(lump.name))) {
                    FUNCS[i].action(this, lump, data);
                    return true;
                }
            }
            this.unknownTypes.push(lump.name);
            return false;
        };
        return Builder;
    }());
    Wad.Builder = Builder;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    function writeMidiHeader() {
        var midiHeaderData = [];
    }
    var MidiHeader = [
        'M'.charCodeAt(0), 'T'.charCodeAt(0), 'h'.charCodeAt(0), 'd'.charCodeAt(0),
        0x00, 0x00, 0x00, 0x06,
        0x00, 0x00,
        0x00, 0x01,
        0x00, 0x46,
        'M'.charCodeAt(0), 'T'.charCodeAt(0), 'r'.charCodeAt(0), 'k'.charCodeAt(0),
        0x00, 0x00, 0x00, 0x00
    ];
    var NUM_CHANNELS = 16;
    var MUS_PERCUSSION_CHAN = 15;
    var MIDI_PERCUSSION_CHAN = 9;
    var MIDI_TRACKLENGTH_OFS = 18;
    var MusToMidi = (function () {
        function MusToMidi(data) {
            this.mus_releasekey = 0x00;
            this.mus_presskey = 0x10;
            this.mus_pitchwheel = 0x20;
            this.mus_systemevent = 0x30;
            this.mus_changecontroller = 0x40;
            this.mus_scoreend = 0x60;
            this.midi_releasekey = 0x80;
            this.midi_presskey = 0x90;
            this.midi_aftertouchkey = 0xA0;
            this.midi_changecontroller = 0xB0;
            this.midi_changepatch = 0xC0;
            this.midi_aftertouchchannel = 0xD0;
            this.midi_pitchwheel = 0xE0;
            this.dataToWrite = [];
            this.channelvelocities = [127, 127, 127, 127, 127, 127, 127, 127,
                127, 127, 127, 127, 127, 127, 127, 127];
            this.queuedTime = 0;
            this.controller_map = [0x00, 0x20, 0x01, 0x07, 0x0A, 0x0B, 0x5B, 0x5D,
                0x40, 0x43, 0x78, 0x7B, 0x7E, 0x7F, 0x79];
            this.channelMap = [];
            this.writePosition = 0;
            this.position = 0;
            this.data = data;
            this.master = this.convert();
        }
        MusToMidi.prototype.getMasterOutput = function () {
            return this.master;
        };
        MusToMidi.prototype.getMIDIChannel = function (musChannel) {
            function allocateMIDIChannel() {
                var result;
                var max;
                var i;
                max = -1;
                for (i = 0; i < NUM_CHANNELS; ++i) {
                    if (this.channelMap[i] > max) {
                        max = this.channelMap[i];
                    }
                }
                result = max + 1;
                if (result == MIDI_PERCUSSION_CHAN) {
                    ++result;
                }
                return result;
            }
            if (musChannel == MUS_PERCUSSION_CHAN) {
                return MIDI_PERCUSSION_CHAN;
            }
            else {
                if (this.channelMap[musChannel] == -1) {
                    this.channelMap[musChannel] = allocateMIDIChannel();
                }
                return this.channelMap[musChannel];
            }
        };
        MusToMidi.prototype.writeData = function (bytes) {
            this.dataToWrite = this.dataToWrite.concat(bytes);
        };
        MusToMidi.prototype.writeTime = function (time) {
            var buffer = time & 0x7F;
            var writeval;
            while ((time >>= 7) != 0) {
                buffer <<= 8;
                buffer |= ((time & 0x7F) | 0x80);
            }
            for (;;) {
                writeval = (buffer & 0xFF);
                this.writeData([writeval]);
                this.trackSize += 1;
                if ((buffer & 0x80) != 0)
                    buffer >>= 8;
                else {
                    this.queuedTime = 0;
                    return;
                }
            }
        };
        MusToMidi.prototype.confirmWrite = function () {
            console.info(this.dataToWrite.length);
            var newBuffer = new ArrayBuffer(this.dataToWrite.length);
            this.outputDataView = new DataView(newBuffer);
            for (var i = 0; i < this.dataToWrite.length; i++) {
                this.outputDataView.setUint8(this.position, this.dataToWrite[i]);
                this.position += 1;
            }
        };
        MusToMidi.prototype.writeEndTrack = function () {
            var endtrack = [0xFF, 0x2F, 0x00];
            this.writeTime(this.queuedTime);
            this.writeData(endtrack);
            this.trackSize += 3;
        };
        MusToMidi.prototype.writePitchWheel = function (channel, wheel) {
            this.writeTime(this.queuedTime);
            var working = this.midi_pitchwheel | channel;
            this.writeData([working]);
            working = wheel & 0x7F;
            this.writeData([working]);
            working = (wheel >> 7) & 0x7F;
            this.writeData([working]);
            this.trackSize += 3;
        };
        MusToMidi.prototype.writePressKey = function (channel, key, velocity) {
            this.writeTime(this.queuedTime);
            var working = this.midi_presskey | channel;
            this.writeData([working]);
            working = key & 0x7F;
            this.writeData([working]);
            working = velocity & 0x7F;
            this.writeData([working]);
            this.trackSize += 3;
        };
        MusToMidi.prototype.writeReleaseKey = function (channel, key) {
            this.writeTime(this.queuedTime);
            var working = this.midi_releasekey | channel;
            this.writeData([working]);
            working = key & 0x7F;
            this.writeData([working]);
            working = 0;
            this.writeData([working]);
            this.trackSize += 3;
        };
        MusToMidi.prototype.readMusHeader = function () {
            var output = {
                id: [],
                scorelength: 0,
                scorestart: 0,
                primarychannels: 0,
                secondarychannels: 0,
                instrumentcount: 0
            };
            for (var i = 0; i < 4; i++) {
                output.id.push(this.data.getUint8(i));
            }
            output.scorelength = this.data.getUint16(4, true);
            output.scorestart = this.data.getUint16(6, true);
            output.primarychannels = this.data.getUint16(8, true);
            output.secondarychannels = this.data.getUint16(10, true);
            output.instrumentcount = this.data.getUint16(12, true);
            return output;
        };
        MusToMidi.prototype.writeChangePatch = function (channel, patch) {
            this.writeTime(this.queuedTime);
            var working = this.midi_changepatch | channel;
            this.writeData([working]);
            working = patch & 0x7F;
            this.writeData([working]);
            this.trackSize += 2;
        };
        MusToMidi.prototype.writeChangeController_Valued = function (channel, control, value) {
            this.writeTime(this.queuedTime);
            var working = this.midi_changecontroller | channel;
            this.writeData([working]);
            working = control & 0x7F;
            this.writeData([working]);
            working = value & 0x80 ? 0x7F : value;
            this.writeData([working]);
            this.trackSize += 3;
        };
        MusToMidi.prototype.writeChangeController_Valueless = function (channel, control) {
            this.writeChangeController_Valued(channel, control, 0);
        };
        MusToMidi.prototype.convert = function () {
            var channel_map = [];
            var musDataView = this.data;
            var musDataPosition = 0;
            console.log('start mus2midi');
            var startTime = Date.now();
            function getMusByte8() {
                var output = musDataView.getUint8(musDataPosition);
                musDataPosition += 1;
                return output;
            }
            var musfileheader;
            var eventdescriptor;
            var channel;
            var mus_event;
            var key;
            var controllernumber;
            var controllervalue;
            var tracksizebuffer = [];
            var hitscoreend = 0;
            var working;
            var timedelay;
            for (channel = 0; channel < NUM_CHANNELS; ++channel) {
                channel_map[channel] = -1;
            }
            musfileheader = this.readMusHeader();
            if (musfileheader.id[0] != 'M'.charCodeAt(0) || musfileheader.id[1] != 'U'.charCodeAt(0)
                || musfileheader.id[2] != 'S'.charCodeAt(0) || musfileheader.id[3] != 0x1A) {
                console.log("mus header fail");
                return null;
            }
            musDataPosition = musfileheader.scorestart;
            writeMidiHeader();
            while (hitscoreend == 0) {
                while (hitscoreend == 0) {
                    eventdescriptor = getMusByte8();
                    this.getMIDIChannel(eventdescriptor & 0x0F);
                    mus_event = eventdescriptor & 0x70;
                    switch (mus_event) {
                        case this.mus_releasekey:
                            key = getMusByte8();
                            this.writeReleaseKey(channel, key);
                            break;
                        case this.mus_presskey:
                            key = getMusByte8();
                            if (key & 0x80) {
                                this.channelvelocities[channel] = getMusByte8();
                                this.channelvelocities[channel] &= 0x7F;
                            }
                            else {
                            }
                            this.writePressKey(channel, key, this.channelvelocities[channel]);
                            break;
                        case this.mus_pitchwheel:
                            key = getMusByte8();
                            this.writePitchWheel(channel, key * 64);
                            break;
                        case this.mus_systemevent:
                            controllernumber = getMusByte8();
                            if (controllernumber < 10 || controllernumber > 14) {
                                console.log('controller number inaccurate 10-14:' + controllernumber);
                                return null;
                            }
                            this.writeChangeController_Valueless(channel, this.controller_map[controllernumber]);
                            break;
                        case this.mus_changecontroller:
                            controllernumber = getMusByte8();
                            controllervalue = getMusByte8();
                            if (controllernumber == 0) {
                                this.writeChangePatch(channel, controllervalue);
                            }
                            else {
                                if (controllernumber < 1 || controllernumber > 9) {
                                    console.log('controller number inaccurate: ' + controllernumber);
                                    return null;
                                }
                                this.writeChangeController_Valued(channel, this.controller_map[controllernumber], controllervalue);
                            }
                            break;
                        case this.mus_scoreend:
                            hitscoreend = 1;
                            break;
                        default:
                            return null;
                    }
                    if ((eventdescriptor & 0x80) != 0) {
                        break;
                    }
                }
                if (hitscoreend == 0) {
                    timedelay = 0;
                    for (;;) {
                        working = getMusByte8();
                        timedelay = timedelay * 128 + (working & 0x7F);
                        if ((working & 0x80) == 0)
                            break;
                    }
                    this.queuedTime += timedelay;
                }
            }
            console.log('finish writing');
            console.log('time: ' + (Date.now() - startTime));
            this.writeEndTrack();
            this.confirmWrite();
            this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 0, (this.trackSize >> 24) & 0xff);
            this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 1, (this.trackSize >> 16) & 0xff);
            this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 2, (this.trackSize >> 8) & 0xff);
            this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 3, this.trackSize & 0xff);
            return this.outputDataView.buffer;
        };
        return MusToMidi;
    }());
    Wad.MusToMidi = MusToMidi;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Flat = (function (_super) {
        __extends(Flat, _super);
        function Flat(playpal, lump, data) {
            var _this = _super.call(this, lump, data) || this;
            var width = 64;
            var height = 64;
            var buffer = new Uint8Array(width * height);
            var colors = playpal.getColors()[0];
            _this.buffer = new Uint8Array(width * height * 4);
            for (var i = 0; i < _this.dataView.byteLength; i++) {
                var index = _this.dataView.getUint8(i);
                _this.buffer[i * 4 + 0] = colors[index].r;
                _this.buffer[i * 4 + 1] = colors[index].g;
                _this.buffer[i * 4 + 2] = colors[index].b;
                _this.buffer[i * 4 + 3] = 255;
            }
            return _this;
        }
        Flat.prototype.getWidth = function () { return 64; };
        Flat.prototype.getHeight = function () { return 64; };
        Flat.prototype.getImageData = function () { return this.buffer; };
        return Flat;
    }(Wad.Lump));
    Wad.Flat = Flat;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Music = (function (_super) {
        __extends(Music, _super);
        function Music(lump, data) {
            return _super.call(this, lump, data) || this;
        }
        Music.prototype.getBuffer = function () {
            return this.buffer;
        };
        return Music;
    }(Wad.Lump));
    Wad.Music = Music;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Node = (function () {
        function Node(offset, dataView, subsectors) {
            this.nodeRightIndex = -1;
            this.nodeLeftIndex = -1;
            this.nodeRight = null;
            this.nodeLeft = null;
            this.ssectorRight = null;
            this.ssectorLeft = null;
            this.x = dataView.getInt16(offset + 0, true);
            this.y = dataView.getInt16(offset + 2, true);
            this.dX = dataView.getInt16(offset + 4, true);
            this.dY = dataView.getInt16(offset + 6, true);
            this.rightUpperY = dataView.getInt16(offset + 8, true);
            this.rightLowerY = dataView.getInt16(offset + 10, true);
            this.rightLowerX = dataView.getInt16(offset + 12, true);
            this.rightUpperX = dataView.getInt16(offset + 14, true);
            this.leftUpperY = dataView.getInt16(offset + 16, true);
            this.leftLowerY = dataView.getInt16(offset + 18, true);
            this.leftLowerX = dataView.getInt16(offset + 20, true);
            this.leftUpperX = dataView.getInt16(offset + 22, true);
            var temp = dataView.getInt16(offset + 24, true);
            if ((temp >> 15) == 0) {
                this.nodeRightIndex = temp;
            }
            else {
                var mask = (1 << 15) - 1;
                this.ssectorRight = subsectors.getSubsector(temp & mask);
            }
            temp = dataView.getInt16(offset + 26, true);
            if ((temp >> 15) == 0) {
                this.nodeLeftIndex = temp;
            }
            else {
                var mask = (1 << 15) - 1;
                this.ssectorLeft = subsectors.getSubsector(temp & mask);
            }
        }
        Node.prototype.setChildren = function (nodes) {
            this.nodeRight = nodes[this.nodeRightIndex] || null;
            this.nodeLeft = nodes[this.nodeLeftIndex] || null;
        };
        Node.prototype.getRightBounds = function () {
            return { uX: this.rightUpperX, uY: this.rightUpperY, lX: this.rightLowerX, lY: this.rightLowerY };
        };
        Node.prototype.getRightNode = function () {
            return this.nodeRight;
        };
        Node.prototype.getLeftBounds = function () {
            return { uX: this.leftUpperX, uY: this.leftUpperY, lX: this.leftLowerX, lY: this.leftLowerY };
        };
        Node.prototype.getLeftNode = function () {
            return this.nodeLeft;
        };
        Node.prototype.getRightSubsector = function () {
            return this.ssectorRight;
        };
        Node.prototype.getLeftSubsector = function () {
            return this.ssectorLeft;
        };
        return Node;
    }());
    Wad.Node = Node;
    var Nodes = (function (_super) {
        __extends(Nodes, _super);
        function Nodes(lump, data, subsectors) {
            var _this = _super.call(this, lump, data) || this;
            _this.nodes = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 28) {
                _this.nodes.push(new Node(i, _this.dataView, subsectors));
            }
            for (var i = 0; i < _this.nodes.length; i++) {
                _this.nodes[i].setChildren(_this.nodes);
            }
            return _this;
        }
        Nodes.prototype.getNode = function () {
            console.info('NODES', this.nodes);
            return this.nodes[this.nodes.length - 1];
        };
        Nodes.prototype.getNodes = function () {
            return this.nodes;
        };
        return Nodes;
    }(Wad.Lump));
    Wad.Nodes = Nodes;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Pname = (function () {
        function Pname(offset, data) {
            this.name = "";
            for (var b = 0; b < 8; b++) {
                var charcode = data.getUint8(offset + b);
                if (charcode == 0)
                    break;
                this.name += String.fromCharCode(charcode);
            }
            this.name = this.name.toUpperCase();
        }
        Pname.prototype.getName = function () {
            return this.name;
        };
        Pname.prototype.setGraphic = function (graphic) {
            this.graphic = graphic;
        };
        Pname.prototype.getGraphics = function () {
            return this.graphic;
        };
        return Pname;
    }());
    Wad.Pname = Pname;
    var Pnames = (function (_super) {
        __extends(Pnames, _super);
        function Pnames(lump, data, textures) {
            var _this = _super.call(this, lump, data) || this;
            var count = _this.dataView.getUint32(0, true);
            _this.pnames = [];
            for (var i = 0; i < count; i++) {
                var offset = (i * 8) + 4;
                _this.pnames.push(new Pname(offset, _this.dataView));
            }
            textures.forEach(function (textures) {
                textures.getTextures().forEach(function (texture) {
                    texture.getPatches().forEach(function (patch) {
                        patch.pname = _this.pnames[patch.pnameIndex];
                    });
                });
            });
            return _this;
        }
        Pnames.prototype.setGraphic = function (graphic) {
            this.pnames.forEach(function (pname) {
                if (graphic.getName() == pname.getName()) {
                    pname.setGraphic(graphic);
                    if (graphic.getName() === 'DOOR3_6') {
                        console.info(graphic.getName(), pname.getName(), pname);
                    }
                    return;
                }
            });
        };
        Pnames.prototype.get = function () {
            return this.pnames;
        };
        return Pnames;
    }(Wad.Lump));
    Wad.Pnames = Pnames;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Reject = (function () {
        function Reject(offset, size, data) {
        }
        return Reject;
    }());
    Wad.Reject = Reject;
    var Rejects = (function (_super) {
        __extends(Rejects, _super);
        function Rejects(lump, data, sectors) {
            var _this = _super.call(this, lump, data) || this;
            _this.rejects = [];
            var size = Math.round((sectors.get().length << 1) / 8);
            for (var i = 0; i < _this.dataView.byteLength; i += size) {
                _this.rejects.push(new Reject(i, size, _this.dataView));
            }
            return _this;
        }
        return Rejects;
    }(Wad.Lump));
    Wad.Rejects = Rejects;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Seg = (function () {
        function Seg(offset, data, vertices, linedefs) {
            this.startVertex = vertices[data.getInt16(offset + 0, true)];
            this.endVertex = vertices[data.getInt16(offset + 2, true)];
            this.angle = data.getInt16(offset + 4, true);
            this.linedef = linedefs[data.getInt16(offset + 6, true)];
            this.direction = data.getInt16(offset + 8, true);
            this.offset = data.getInt16(offset + 10, true);
        }
        Seg.prototype.getStartVertex = function () {
            return this.startVertex;
        };
        Seg.prototype.getEndVertex = function () {
            return this.endVertex;
        };
        Seg.prototype.getLinedef = function () {
            return this.linedef;
        };
        return Seg;
    }());
    Wad.Seg = Seg;
    var Segs = (function (_super) {
        __extends(Segs, _super);
        function Segs(lump, data, vertices, linedefs) {
            var _this = _super.call(this, lump, data) || this;
            _this.segs = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 12) {
                _this.segs.push(new Seg(i, _this.dataView, vertices, linedefs));
            }
            return _this;
        }
        Segs.prototype.getSeg = function (index) {
            return this.segs[index];
        };
        return Segs;
    }(Wad.Lump));
    Wad.Segs = Segs;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Subsector = (function () {
        function Subsector(offset, data, segs) {
            this.segsCount = data.getUint16(offset, true);
            this.segsOffset = data.getUint16(offset + 2, true);
            this.segs = [];
            for (var i = 0; i < this.segsCount; i++) {
                this.segs.push(segs.getSeg(i + this.segsOffset));
            }
        }
        Subsector.prototype.getSegs = function () {
            return this.segs;
        };
        return Subsector;
    }());
    Wad.Subsector = Subsector;
    var Subsectors = (function (_super) {
        __extends(Subsectors, _super);
        function Subsectors(lump, data, segs) {
            var _this = _super.call(this, lump, data) || this;
            _this.subsectors = [];
            for (var i = 0; i < _this.dataView.byteLength; i += 4) {
                _this.subsectors.push(new Subsector(i, _this.dataView, segs));
            }
            return _this;
        }
        Subsectors.prototype.getSubsector = function (index) {
            return this.subsectors[index];
        };
        return Subsectors;
    }(Wad.Lump));
    Wad.Subsectors = Subsectors;
})(Wad || (Wad = {}));
var Wad;
(function (Wad) {
    var Textures = (function (_super) {
        __extends(Textures, _super);
        function Textures(parser, playpal, lump, data) {
            var _this = _super.call(this, lump, data) || this;
            _this.count = _this.dataView.getUint32(0, true);
            _this.offset = _this.dataView.getUint32(4, true);
            _this.textures = [];
            var tempOffset = _this.offset + lump.pos;
            for (var i = 0; i < _this.count; i++) {
                var data = parser.getDataByOffset(tempOffset, 5000);
                var texture = new Wad.Texture(playpal, data);
                _this.textures.push(texture);
                tempOffset += texture.getSize();
            }
            return _this;
        }
        Textures.prototype.setPnames = function (pnames) {
        };
        Textures.prototype.getTextureByName = function (name) {
            for (var i = 0; i < this.textures.length; i++) {
                if (name === this.textures[i].getName()) {
                    return this.textures[i];
                }
            }
            return null;
        };
        Textures.prototype.getTextures = function () {
            return this.textures;
        };
        return Textures;
    }(Wad.Lump));
    Wad.Textures = Textures;
})(Wad || (Wad = {}));
//# sourceMappingURL=index.js.map