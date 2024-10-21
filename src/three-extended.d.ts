// Definir correctamente los tipos para ParametricGeometry
declare module 'three/examples/jsm/geometries/ParametricGeometry' {
  import { BufferGeometry } from 'three';

  export class ParametricGeometry extends BufferGeometry {
    constructor(
      func: (u: number, v: number, target: THREE.Vector3) => void,
      slices: number,
      stacks: number
    );
  }
}
