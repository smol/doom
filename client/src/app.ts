import WadParser from './engine/wad/Wad';
import WadBuilder from './engine/wad/Builder';
import Core from './engine/Core';

class App extends Core {
	private socket: any;

	constructor() {
		super('canvas', 1);

		var parser: WadParser = new WadParser();
		var builder : WadBuilder = new WadBuilder(parser);

		parser.onLoad = () => {
			builder.go();
			
			builder.debug();
			// var temp = parser.getLumpByName("TEXTURE1");
			// console.warn(temp);
			// var dv = new DataView(temp);
			// // var colormaps = [];
			// // for (var i = 0; i < 34; i++) {
			// // 	var cm = [];
			// // 	for (var j = 0; j < 256; j++) {
			// // 		cm.push(dv.getUint8((i * 256) + j));
			// // 	}
			// // 	colormaps.push(cm);
			// // }

			// console.warn(dv);
		};

		parser.loadFile('/client/assets/doom.wad');

	}
}

(function () {

	var ready = function (fn) {

		// Sanity check
		if (typeof fn !== 'function') return;

		// If document is already loaded, run method
		if (document.readyState === 'complete') {
			return fn();
		}

		// Otherwise, wait until document is loaded
		// The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading. The state indicates that the DOMContentLoaded event has been fired.
		document.addEventListener('DOMContentLoaded', fn, false);

		// Alternative: The document and all sub-resources have finished loading. The state indicates that the load event has been fired.
		// document.addEventListener( 'complete', fn, false );

	};

	// Example
	ready(function () {
		new App();
	});
})();;
