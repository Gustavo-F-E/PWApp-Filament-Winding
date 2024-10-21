// src/types/three-extensions.d.ts
declare module 'three/examples/jsm/geometries/ParametricGeometry' {
  import { Geometry } from 'three';

  export class ParametricGeometry extends Geometry {
    constructor(
      func: (u: number, v: number, target: THREE.Vector3) => void,
      slices: number,
      stacks: number
    );
  }
}
