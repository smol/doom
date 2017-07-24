module Wad {
	export class Node {
		private x: number; // X coordinate of partition line's start
		private y: number; // Y coordinate of partition line's start


		private dX: number; // DX, change in X to end of partition line
		private dY: number; // DY, change in Y to end of partition line

		private rightUpperY: number; // Y upper bound for right bounding-box.\
		private rightLowerY: number; // Y lower bound                         All SEGS in right child of node
		private rightLowerX: number; // X lower bound                         must be within this box.
		private rightUpperX: number; // X upper bound                        /

		private leftUpperY: number; // Y upper bound for left bounding box. \
		private leftLowerY: number; // Y lower bound                         All SEGS in left child of node
		private leftLowerX: number; // X lower bound                         must be within this box.
		private leftUpperX: number; // X upper bound                        /

		/* 							   a NODE or SSECTOR number for the right child. If bit 15 of this */
		private nodeRightIndex: number = -1;	/* <short> is set, then the rest of the number represents the */
		private nodeLeftIndex: number = -1;	/* child SSECTOR. If not, the child is a recursed node. */

		private nodeRight : Node = null;
		private nodeLeft : Node = null;

		private ssector : number = -1;

		constructor(offset: number, dataView: DataView) {
			this.x = dataView.getUint16(offset + 0, true);
			this.y = dataView.getUint16(offset + 2, true);

			this.dX = dataView.getUint16(offset + 4, true);
			this.dY = dataView.getUint16(offset + 6, true);

			this.rightUpperY = dataView.getUint16(offset + 8, true);
			this.rightLowerY = dataView.getUint16(offset + 10, true);
			this.rightLowerX = dataView.getUint16(offset + 12, true);
			this.rightUpperX = dataView.getUint16(offset + 14, true);

			this.leftUpperY = dataView.getUint16(offset + 16, true);
			this.leftLowerY = dataView.getUint16(offset + 18, true);
			this.leftLowerX = dataView.getUint16(offset + 20, true);
			this.leftUpperX = dataView.getUint16(offset + 22, true);

			var temp = dataView.getUint16(offset + 24, true);

			// console.info(temp, temp >> 15, temp >> 1);

			if ((temp >> 15) == 0){
				this.nodeRightIndex = temp >> 1;
			} else {
				this.ssector = temp >> 1;
			}

			temp = dataView.getUint16(offset + 26, true);

			// console.info(temp, temp >> 15, temp >> 1);

			if ((temp >> 15) == 0){
				this.nodeLeftIndex = temp >> 1;
			} else {
				this.ssector = temp >> 1;
			}
		}

		setChildren(nodes : Node[]){
			this.nodeRight = nodes[this.nodeRightIndex] || null;
			this.nodeLeft = nodes[this.nodeLeftIndex] || null;
		}
	}

	export class Nodes extends Lump {
		private nodes: Node[] = []

		constructor(lump: any, data: any) {
			super(lump, data);

			for (var i = 0; i < this.dataView.byteLength; i += 28) {
				this.nodes.push(new Node(i, this.dataView));
			}


			for (var i = 0; i < this.nodes.length; i++){
				this.nodes[i].setChildren(this.nodes);
			}

			console.info('NODES', lump.pos, this.nodes);
		}
	}
}