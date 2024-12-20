// src/app/crear-mandril/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import styles from '../css/crearMandril_page.module.css';
import VerBobinados from '../components/VerBobinados';
import MostrarBobinado from '../components/MostrarBobinado';
import MostrarCapas from '../components/MostrarCapas';


interface Bobinado {
  id: string;
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
  espesor: number;
  capas: Capa[];
}

// Define la interfaz para las capas
interface Capa {
  id: string;
  id_bobinado: string;
  alfa_original: number;
  alfa_corregido: number;
  velocidad_de_alimentacion: number;
  ancho: number;
  ancho_eff: number;
  NP: number;
  patron_elegido: number;
  diametro_mandril?: number; // Agregado para evitar problemas al acceder al diametro_mandril
}

// Función para obtener los datos del servidor
async function fetchBobinados(): Promise<Bobinado[]> {
  const response = await fetch('/api/crearMandril/bobinados'); /*nextjs asume el método GET automaticamente por defecto*/
  if (!response.ok) throw new Error('Error fetching Bobinados');
  return await response.json();
}

// Función para obtener las capas del servidor
async function fetchCapas(id_bobinado: string): Promise<Capa[]> {
  const response = await fetch(`/api/crearMandril/capas?id_bobinado=${id_bobinado}`); /*nextjs asume el método GET automaticamente por defecto*/
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

  const handleVerDetalles = async (id: string) => {
    const bobinado = bobinados.find(b => b.id === id);
  
    if (bobinado) {
      try {
        // Obtén las capas relacionadas con el bobinado
        const capas = await fetchCapas(bobinado.id); 
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