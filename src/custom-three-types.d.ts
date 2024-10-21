declare module 'three/examples/jsm/controls/OrbitControls' {
  export class OrbitControls {
    constructor(object: THREE.Camera, domElement: HTMLElement);
    update(): void;
    enableDamping: boolean;
    dampingFactor: number;
  }
}
