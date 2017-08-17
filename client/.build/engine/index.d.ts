/// <reference path="../../../node_modules/@types/three/index.d.ts" />
/// <reference types="wad" />
declare const STATE: {
    NONE: number;
    ROTATE: number;
    DOLLY: number;
    PAN: number;
    TOUCH_ROTATE: number;
    TOUCH_DOLLY: number;
    TOUCH_PAN: number;
};
declare const CHANGE_EVENT: {
    type: string;
};
declare const START_EVENT: {
    type: string;
};
declare const END_EVENT: {
    type: string;
};
declare const EPS = 0.000001;
declare module Engine {
    class OrbitControls extends THREE.EventDispatcher {
        object: THREE.Camera;
        domElement: HTMLElement | HTMLDocument;
        window: Window;
        enabled: boolean;
        target: THREE.Vector3;
        enableZoom: boolean;
        zoomSpeed: number;
        minDistance: number;
        maxDistance: number;
        enableRotate: boolean;
        rotateSpeed: number;
        enablePan: boolean;
        keyPanSpeed: number;
        autoRotate: boolean;
        autoRotateSpeed: number;
        minZoom: number;
        maxZoom: number;
        minPolarAngle: number;
        maxPolarAngle: number;
        minAzimuthAngle: number;
        maxAzimuthAngle: number;
        enableKeys: boolean;
        keys: {
            LEFT: number;
            UP: number;
            RIGHT: number;
            BOTTOM: number;
        };
        mouseButtons: {
            ORBIT: THREE.MOUSE;
            ZOOM: THREE.MOUSE;
            PAN: THREE.MOUSE;
        };
        enableDamping: boolean;
        dampingFactor: number;
        private spherical;
        private sphericalDelta;
        private scale;
        private target0;
        private position0;
        private zoom0;
        private state;
        private panOffset;
        private zoomChanged;
        private rotateStart;
        private rotateEnd;
        private rotateDelta;
        private panStart;
        private panEnd;
        private panDelta;
        private dollyStart;
        private dollyEnd;
        private dollyDelta;
        private updateLastPosition;
        private updateOffset;
        private updateQuat;
        private updateLastQuaternion;
        private updateQuatInverse;
        private panLeftV;
        private panUpV;
        private panInternalOffset;
        private onContextMenu;
        private onMouseUp;
        private onMouseDown;
        private onMouseMove;
        private onMouseWheel;
        private onTouchStart;
        private onTouchEnd;
        private onTouchMove;
        private onKeyDown;
        constructor(object: THREE.Camera, domElement?: HTMLElement, domWindow?: Window);
        update(): boolean;
        panLeft(distance: number, objectMatrix: any): void;
        panUp(distance: number, objectMatrix: any): void;
        pan(deltaX: number, deltaY: number): void;
        dollyIn(dollyScale: any): void;
        dollyOut(dollyScale: any): void;
        getAutoRotationAngle(): number;
        getZoomScale(): number;
        rotateLeft(angle: number): void;
        rotateUp(angle: number): void;
        getPolarAngle(): number;
        getAzimuthalAngle(): number;
        dispose(): void;
        reset(): void;
        readonly center: THREE.Vector3;
        noZoom: boolean;
    }
}
declare module Engine {
    class Wall extends THREE.Group {
        private textures;
        private lowerSector;
        private upperSector;
        private middleSector;
        constructor(textures: Wad.Textures[]);
        setVertexes(firstVertex: THREE.Vector2, secondVertex: THREE.Vector2, rightSidedef: Wad.Sidedef, leftSidedef: Wad.Sidedef): void;
        private getTexture(name);
        getUpperVertexes(): THREE.Vector3[];
        getLowerVertexes(): THREE.Vector3[];
        getMiddleVertexes(): THREE.Vector3[];
    }
}
declare module Engine {
    class Core {
        private scene;
        private camera;
        private textures;
        constructor(canvas: HTMLCanvasElement);
        private initCamera(canvas);
        private initScene(canvas);
        private node(level, node);
        private subsector(subsector);
        createWalls(map: Wad.Map, wad: Wad.Wad): void;
    }
}
declare module Engine {
    class Floor extends THREE.Group {
        private mesh;
        private material;
        private geometry;
        private textures;
        seg: Wad.Seg;
        constructor(textures: Wad.Textures[]);
        private createFaces();
        addVertex(vertex: THREE.Vector3): void;
        create(): void;
    }
}
declare module Engine {
    class Sector {
        private floor;
        private walls;
        private textures;
        constructor(subsector: Wad.Subsector, textures: Wad.Textures[], scene: THREE.Scene);
        private createFloor();
        private createWall(seg);
    }
}
