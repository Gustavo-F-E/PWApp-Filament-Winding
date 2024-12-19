// src/app/crear-mandril/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import styles from '../css/crearMandril_page.module.css';
import VerBobinados from '../components/VerBobinados';
import MostrarBobinado from '../components/MostrarBobinado';
import MostrarCapas from '../components/MostrarCapas';


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
  capas: Capa[]; // Asegúrate de incluir la propiedad 'capas' si es necesaria
}

// Define la interfaz para las capas
interface Capa {
  nombre: string;
  alfa_original: number;
  alfa_corregido: number;
  velocidad_de_alimentacion: number;
  ancho: number;
  ancho_eff: number;
  NP: number;
  patron_elegido: number;
}

// Función para obtener los datos del servidor
async function fetchBobinados(): Promise<Bobinado[]> {
  const response = await fetch('/api/crearMandril/bobinados');
  if (!response.ok) throw new Error('Error fetching Bobinados');
  return await response.json();
}

// Función para obtener las capas del servidor
async function fetchCapas(nombre: string): Promise<Capa[]> {
  const response = await fetch(`/api/crearMandril/capas?nombre=${nombre}`);
  if (!response.ok) throw new Error('Error fetching Capas');
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

  /*const handleVerDetalles = (nombre: string) => {
    const bobinado = bobinados.find(b => b.nombre_del_bobinado === nombre);
    setBobinadoElegido(bobinado || null);
  };*/

  const handleVerDetalles = async (nombre: string) => {
    const bobinado = bobinados.find(b => b.nombre_del_bobinado === nombre);
  
    if (bobinado) {
      try {
        // Obtén las capas relacionadas con el bobinado
        const capas = await fetchCapas(bobinado.nombre_del_bobinado); 
        setBobinadoElegido({ ...bobinado, capas });  // Aquí añadimos las capas al estado
      } catch (error) {
        console.error('Error fetching capas:', error);
      }
    } else {
      setBobinadoElegido(null);
    }
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
      <article className={styles.capasBobinadoElegido}>
        <MostrarCapas bobinadoElegido={bobinadoElegido} />
      </article>
      <article className={styles.editarBobinado}></article>
      <article className={styles.edicionCapa}></article>
      <article className={styles.graficos}></article>
      <article className={styles.crearBobinado}></article>
    </section>
  );
}

export default CrearMandril;