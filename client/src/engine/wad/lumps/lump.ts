export default class Lump {
	protected lump : any;
	protected data : any;
	protected dataView : DataView;

	protected debugContainer : HTMLElement;

	constructor(lump: any, data: any){
		this.lump = lump;
		this.data = data;

		this.dataView = new DataView(this.data);
	}

	debug(element: HTMLElement){
		this.debugContainer = element;

		var lumpsList : HTMLElement = element.getElementsByClassName('lumps')[0] as HTMLElement;
		var li = document.createElement('li');
		
		li.innerHTML = this.lump.name;

		var self = this;
		li.onclick = () => {
			self.onclick();
		};

		lumpsList.appendChild(li);
	}

	protected onclick(){
		var oldContainer = this.debugContainer.getElementsByClassName('debug-container');

		if (oldContainer.length > 0){
			oldContainer[0].remove();
		}
		

		
	}
}