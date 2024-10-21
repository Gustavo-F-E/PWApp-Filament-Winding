// ParametricCurve.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { Text } from "@react-three/drei"; // Importa el componente Text

// Función para definir la hélice
const helixFunction = (u: number, v: number, target: THREE.Vector3) => {
  const radius = 1; // Radio de la hélice
  const height = 2; // Altura total de la hélice
  const angle = Math.PI * 2 * u; // Dos vueltas

  target.set(
    radius * Math.cos(angle),
    height * v, // Proporción de la altura
    radius * Math.sin(angle)
  );
};

// Componente para la hélice
const Helix = () => {
  const helixRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    const helixGeometry = new ParametricGeometry(helixFunction, 100, 10);
    const helixMaterial = new THREE.LineBasicMaterial({ color: "red" });

    const helixLine = new THREE.Line(helixGeometry, helixMaterial);
    helixRef.current = helixLine;

    return () => {
      if (helixRef.current) {
        helixRef.current.geometry.dispose();
        (helixRef.current.material as THREE.LineBasicMaterial).dispose();
      }
    };
  }, []);

  return helixRef.current ? <primitive object={helixRef.current} /> : null;
};

// Componente para el cilindro
const Cylinder = () => {
  const geometry = new THREE.CylinderGeometry(1, 1, 6, 32);
  const material = new THREE.MeshBasicMaterial({
    color: "gray",
    transparent: true,
    opacity: 0.4,
  });
  return <mesh geometry={geometry} material={material} />;
};

// Componente para los ejes XYZ (como flechas)
const Axes = () => {
  const axisLength = 5; // Longitud de los ejes
  const arrowHeadLength = 0.2; // Longitud de la cabeza de la flecha
  const arrowHeadWidth = 0.2; // Ancho de la cabeza de la flecha
  const arrowHelperX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLength, 0xff0000, arrowHeadLength, arrowHeadWidth); // Eje X en rojo
  const arrowHelperY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLength, 0x00ff00, arrowHeadLength, arrowHeadWidth); // Eje Y en verde
  const arrowHelperZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLength, 0x0000ff, arrowHeadLength, arrowHeadWidth); // Eje Z en azul

  return (
    <>
      <primitive object={arrowHelperX} />
      <primitive object={arrowHelperY} />
      <primitive object={arrowHelperZ} />
      {/* Escala numérica en los ejes usando Text de drei */}
      <Text position={[axisLength, 0, 0]} fontSize={0.3} color="red">
        X
      </Text>
      <Text position={[0, axisLength, 0]} fontSize={0.3} color="green">
        Y
      </Text>
      <Text position={[0, 0, axisLength]} fontSize={0.3} color="blue">
        Z
      </Text>
    </>
  );
};

// Componente para los controles
const Controls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    controlsRef.current = new OrbitControls(camera, gl.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.25;

    return () => {
      // No destruir los controles, queremos mantenerlos
    };
  }, [camera, gl]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return null;
};

// Componente principal
const ParametricCurveWithCylinder = () => {
  return (
    <Canvas style={{ backgroundColor: "white", height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Helix />
      <Cylinder />
      <Axes />
      <Controls /> {/* Usa Controls aquí */}
    </Canvas>
  );
};

export default ParametricCurveWithCylinder;
