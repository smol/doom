export default class TreeView {
	private list : HTMLUListElement;

	constructor(){
		this.list = document.createElement('ul') as HTMLUListElement;

		document.getElementsByTagName('body')[0].appendChild(this.list);
	}

	setItems(items: any[]){
		this.list.innerHTML = '';

		
	}
}