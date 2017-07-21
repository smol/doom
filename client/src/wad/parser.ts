module Wad {
	export class Parser {
		public onLoad : () => void;

		private lumps: any[];
		private ident: string;
		private numlumps: number;
		private dictpos: number;
		private data: any;

		constructor() {

		}

		loadFile(filePath: string) {
			console.warn('Load WAD FILE', filePath);
			var self = this;

			var xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.open('GET', filePath, true);
			xhr.responseType = 'blob';
			xhr.onload = function (e) {
				if (xhr.status == 200) {
					self.readFile(xhr.response);
				}
			};

			xhr.send(null);
		}

		private readFile(blob: any) {
			var self = this;

			this.lumps = [];

			var offset: number = 0;
			var chunkSize: number = 1;

			var reader = new FileReader();
			reader.readAsArrayBuffer(blob);

			reader.onload = function (e) {
				var result: any = (e.target as any).result;
				self.data = result;

				// console.warn((e.target as any).result);

				// header reading
				var headerReader = new DataView(result);
				self.ident = '';

				for (var i = 0; i < 4; i++) {
					self.ident += String.fromCharCode(headerReader.getUint8(i));
				}

				if (self.ident != "IWAD" && self.ident != "PWAD") {

					// self.error("Not a valid WAD file.");
					// self.onLoad();
				} else {
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
					}
					self.lumps.push(lumpEntry);
				}
				
				if (offset >= blob.size) {
					// for (var i = 0; i < self.lumps.length; i++){
						
					// 	// if self.lumps
					// 	// console.warn(self.lumps[i].name);
					// }
					self.onLoad();
					// self.onProgress();
					// self.onLoad();
					// self.playpal = Object.create(Playpal);
					// if (self.lumpExists("PLAYPAL")) {
					// 	// console.warn(self.getLumpByName("PLAYPAL"));
					// 	// self.playpal.load(wad.getLumpByName("PLAYPAL"));
					// }

					return;
				}

				chunkReaderBlock(offset, chunkSize, blob)
			}

			var chunkReaderBlock = function (offset: number, chunkSize: number, data: any) {
				var r = new FileReader();
				var b = data.slice(offset, offset + chunkSize);
				r.onload = nextChunk;
				// r.onprogress = self.onProgress;
				r.readAsArrayBuffer(b);
			}
		}

		private lumpExists(name: string) {
			for (var i = 0; i < this.numlumps; i++) {
				if (this.lumps[i].name == name) {
					return true;
				}
			}
			return false;
		}

		getLumpByName(name) {
			for (var i = 0; i < this.numlumps; i++) {
				if (this.lumps[i].name == name) {
					var l = this.lumps[i];
					return this.data.slice(l.pos, l.pos + l.size);
				}
			}
			return null;
		}

		getDataByOffset(offset : number, size: number){
			return this.data.slice(offset, offset + size);
		}

		getDataByLump(lump: any){
			return this.data.slice(lump.pos, lump.pos + lump.size);
		}

		private getLumpIndexByName(name) {
			for (var i = this.numlumps - 1; i >= 0; i--) {
				if (this.lumps[i].name == name) {
					return i;
				}
			}
			return null;
		}

		private getLumpAsText(index) {
			var dat = this.getLump(index);
			return this.lumpDataToText(dat);
		}

		private lumpDataToText(data) {
			var output = "";
			var dv = new DataView(data);
			for (var i = 0; i < data.byteLength; i++) output += String.fromCharCode(dv.getUint8(i));
			return output;
		}

		private getLump(index) {
			var l = this.lumps[index];
			return this.data.slice(l.pos, l.pos + l.size);
		}

		getLumps() : any[] {
			return this.lumps;
		}
	}
}

