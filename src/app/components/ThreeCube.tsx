"use client"; // Necesario para habilitar el renderizado del lado del cliente en Next.js

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeCube = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Crea la escena
    const scene = new THREE.Scene();

    // Crea la cámara (campo de visión, relación de aspecto, plano cercano, plano lejano)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // Coloca la cámara más lejos del cubo

    // Crea el renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Crea la geometría y el material del cubo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Añade el cubo a la escena
    scene.add(cube);

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Rota el cubo
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Renderiza la escena y la cámara
      renderer.render(scene, camera);
    };

    // Inicia la animación
    animate();

    // Cleanup: Elimina el renderizador cuando el componente se desmonta
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "60vw", height: "60vh" }} />;
};

export default ThreeCube;
