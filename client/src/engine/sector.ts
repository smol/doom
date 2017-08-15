module Engine {
	export class Sector {
		constructor(subsector: Wad.Subsector, textures : Wad.Textures[], scene: THREE.Scene) {
			var segs: Wad.Seg[] = subsector.getSegs();
		
			if (segs.length > 1) {
				let floor = new Engine.Floor(textures);
				scene.add(floor);

				for (var i = 0; i < segs.length; i++) {
					floor.addSeg(segs[i]);
				}

				floor.create();
			}

			// scene.add(new Engine.Floor(segs));
		}
	}
}