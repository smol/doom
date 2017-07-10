import Graphic from 'wad/lumps/Graphic';

class GraphicDebug {
	private graphic: Graphic;

	constructor(graphic: Graphic, container: HTMLElement) {
		this.graphic = graphic;
		var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
		var self = this;

		li.innerHTML = graphic.getName();

		li.onclick = () => {
			self.setPreview();
		}

		container.appendChild(li);
	}

	private setPreview(){
		var preview = document.getElementById('preview');
		preview.innerHTML = '';

		var canvas: HTMLCanvasElement = document.createElement('canvas');
		
		canvas.height = this.graphic.getHeight();
		canvas.width = this.graphic.getWidth();
		canvas.className = 'debug-container endoom';

		var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
		var idata: ImageData = ctx.createImageData(canvas.width, canvas.height);

		idata.data.set(this.graphic.getImageData());

		ctx.putImageData(idata, 0, 0);
		// ctx.scale(3,3);

		preview.appendChild(canvas);
	}
}

export default class GraphicsDebug {
	private graphics: Graphic[];

	constructor(graphics: Graphic[], container: HTMLElement) {
		this.graphics = graphics;
		var self = this;

		var li: HTMLLIElement = document.createElement('li') as HTMLLIElement;
		li.innerHTML = 'GRAPHICS';
		container.appendChild(li);

		li.onclick = () => {
			self.setList();
		};
	}

	private setList() {
		var subtree = document.getElementsByClassName('subtree');

		if (subtree.length > 0) {
			subtree[0].remove();
		}


		var ul: HTMLUListElement = document.createElement('ul') as HTMLUListElement;
		ul.className = 'subtree';

		this.graphics.forEach((item) => {
			new GraphicDebug(item, ul);

		});

		document.getElementById('treeview').appendChild(ul);
	}
}