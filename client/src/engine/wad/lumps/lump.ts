var groups : { [name:string] : string } = {
	'D_.*' : 'D_s',
	'E\\dM\\d' : 'ExMx',
	'DEMO\\d' : 'Demos',
	'END\\d' : 'ENDs',
	'AMMNUM\\d' : 'AMMNUMs',
	'STG.*' : 'STGs',
	'STT.*' : 'STTs',
	'WIA\\d' : 'WIAs',
	'STCFN\\d' : 'STCFNs',
	'STKEYS\\d' : 'STKEYs',
	'DP.*' : 'DPs',
	'DS.*' : 'DSs',
};

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

		var className = null;
		for (var key in groups){
			var regex = new RegExp(key);
			if (regex.test(this.lump.name)){
				className = groups[key];
				break;
			}
		}
		
		var lumpsList : HTMLElement = element.getElementsByClassName('lumps')[0] as HTMLElement;
		var container : HTMLElement = lumpsList;

		if (className !== null){

			var groupsElem = lumpsList.getElementsByClassName(className);
			if (groupsElem.length === 0) {
				var group = document.createElement('li');
				
				group.className = 'group ' + className;

				var header = document.createElement('div');
				header.className = 'header';
				header.innerHTML = className;
				header.onclick = () => {
					var ul : HTMLElement = group.getElementsByTagName('ul')[0];
					ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
				};

				group.appendChild(header);


				container = document.createElement('ul');
				group.appendChild(container);
				lumpsList.appendChild(group);
			} else {
				container = groupsElem[0].getElementsByTagName('ul')[0];
			}

			
		}
		

		var li = document.createElement('li');

		
		
		li.innerHTML = this.lump.name;

		var self = this;
		li.onclick = () => {
			self.onclick();
		};

		container.appendChild(li);
	}

	protected onclick(){
		var oldContainer = this.debugContainer.getElementsByClassName('debug-container');

		if (oldContainer.length > 0){
			oldContainer[0].remove();
		}
		

		
	}
}