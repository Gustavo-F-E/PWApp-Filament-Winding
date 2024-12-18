// src/app/crear-mandril/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import styles from '../css/crearMandril_page.module.css';
import VerBobinados from '../components/VerBobinados';
import MostrarBobinado from '../components/MostrarBobinado';


interface VerBobinados {
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

// Define la interfaz para los datos de cada bobinado
interface Bobinado {
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
  espesor: number;
}

// Función para obtener los datos del servidor
async function fetchBobinados(): Promise<Bobinado[]> {
  const response = await fetch('/api/crearMandril/bobinados');
  if (!response.ok) throw new Error('Error fetching Bobinados');
  return await response.json();
}

function CrearMandril() {
  const [bobinados, setBobinados] = useState<Bobinado[]>([]);
  const [bobinadoElegido, setBobinadoElegido] = useState<Bobinado | null>(null);

  useEffect(() => {
    fetchBobinados()
      .then(setBobinados)
      .catch(console.error);
  }, []);

  const handleVerDetalles = (nombre: string) => {
    const bobinado = bobinados.find(b => b.nombre_del_bobinado === nombre);
    setBobinadoElegido(bobinado || null);
  };

  const handleCrearBobinado = () => {
    console.log('Crear un bobinado');
  };

  return (
    <section className={styles.container}>
      <article className={styles.verBobinados}>
      <VerBobinados
        bobinados={bobinados}
        onVerDetalles={handleVerDetalles}
        onCrearBobinado={handleCrearBobinado}
      />
      </article>
      <article className={styles.bobinadoElegido}>
        <MostrarBobinado bobinadoElegido={bobinadoElegido} />
      </article>
      <article className={styles.capasBobinadoElegido}></article>
      <article className={styles.opcionesBobinado}></article>
      <article className={styles.edicionCapa}></article>
      <article className={styles.graficos}></article>
      <article className={styles.crearBobinado}></article>
    </section>
  );
}

export default CrearMandril;