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

		private ssectorRight : Subsector = null;
		private ssectorLeft : Subsector = null;

		private nodeParent : Node = null;

		constructor(offset: number, dataView: DataView, subsectors : Subsectors) {
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
			if ((temp >> 15) == 0){
				this.nodeRightIndex = temp;
			} else {
				var mask : number = (1 << 15) - 1;
				this.ssectorRight = subsectors.getSubsector(temp & mask);
			}

			temp = dataView.getInt16(offset + 26, true);
			if ((temp >> 15) == 0){
				this.nodeLeftIndex = temp;
			} else {
				var mask : number = (1 << 15) - 1;
				this.ssectorLeft = subsectors.getSubsector(temp & mask);
			}
		}

		setChildren(nodes : Node[]){
			this.nodeRight = nodes[this.nodeRightIndex] || null;
			this.nodeLeft = nodes[this.nodeLeftIndex] || null;

			if (this.nodeRight)
				this.nodeRight.nodeParent = this;

			if (this.nodeLeft)
				this.nodeLeft.nodeParent = this;
		}

		getRightBounds() : { uX: number, uY: number, lX : number, lY: number } {
			return { uX: this.rightUpperX, uY: this.rightUpperY, lX: this.rightLowerX, lY: this.rightLowerY };
		}

		getRightNode() : Node {
			return this.nodeRight;
		}

		getLeftBounds() : { uX: number, uY: number, lX : number, lY: number } {
			return { uX: this.leftUpperX, uY: this.leftUpperY, lX: this.leftLowerX, lY: this.leftLowerY };
		}

		getParent() :Node {
			return this.nodeParent;
		}

		getLeftNode() : Node {
			return this.nodeLeft;
		}

		getRightSubsector() : Subsector {
			return this.ssectorRight;
		}

		getLeftSubsector() : Subsector {
			return this.ssectorLeft;
		}
	}

	export class Nodes extends Lump {
		private nodes: Node[] = []

		constructor(lump: any, data: any, subsectors : Subsectors) {
			super(lump, data);

			for (var i = 0; i < this.dataView.byteLength; i += 28) {
				this.nodes.push(new Node(i, this.dataView, subsectors));
			}

			for (var i = 0; i < this.nodes.length; i++){
				this.nodes[i].setChildren(this.nodes);
			}
		}

		getNode() : Node {
			return this.nodes[this.nodes.length - 1];
		}

		getNodes() : Node[] {
			return this.nodes;
		}
	}
}