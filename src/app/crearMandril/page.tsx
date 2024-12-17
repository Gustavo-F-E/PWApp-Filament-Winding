// src/app/crear-mandril/page.tsx
/*"use client";

import React, { useState, useEffect } from 'react'
import styles from './crearMandril.module.css';

// Define la interfaz para los datos de cada bobinado
interface Bobinado {
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
  diametro:	number;
	longitud: number;
	pines: boolean;
	usuario: string;
}

const handleCrearBobinado = () => {
  console.log(`Crea un bobinado`);
  // Navega a una página de detalles o muestra un modal.
};


//Función para obtener los datos del servidor 
async function fetchBobinados(): Promise<Bobinado[]> {
  const response = await fetch('/api/crearMandril/bobinados'); // URL corregida 
  if (!response.ok) {
    throw new Error('Error fetching Bobinados');
  }
  const data = await response.json();
  console.log('Datos de Bobinados:', data); // Añadir aquí el console.log 
  return data;
}
function CrearMandril() {
  const [bobinados, setBobinados] = useState<Bobinado[]>([]); // Nombres de variables consistentes 
  const [bobinadoElegido, setBobinadoElegido] = useState<Bobinado | null>(null);

  useEffect(() => {
    fetchBobinados()
      .then(data => setBobinados(data))
      .catch(error => console.error('Error fetching Bobinados:', error));
  }, []);

  const handleVerDetalles = (nombre_del_bobinado: string) => {
    const bobinado = bobinados.find(b => b.nombre_del_bobinado === nombre_del_bobinado);
    setBobinadoElegido(bobinado || null);
  };

  return (
    <section className={styles.container}>
      <article className={styles.verBobinados}>
      <h2 className={styles.h2}>Lista de bobinados</h2>
      {bobinados.length === 0 ? (
        <p>No hay bobinados para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr className={styles.th}>
              <th >Denominación</th>
              <th>Creación</th>
              <th>Última modificación</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody> {bobinados.map((bobinado) => (<tr key={bobinado.nombre_del_bobinado}>
            <td>{bobinado.nombre_del_bobinado}</td>
            <td>{new Date(bobinado.fecha_creacion).toLocaleDateString('es-ES')}</td>
            <td>{new Date(bobinado.fecha_ultima_modificacion).toLocaleDateString('es-ES')}</td>
            <td><button onClick={() => handleVerDetalles(bobinado.nombre_del_bobinado)}>Ver</button></td>
          </tr>))}
          </tbody>
          </table>)}
          <div className={styles.crearBobinado}>
            <button  onClick={() => handleCrearBobinado()}>Crear Bobinado</button>
          </div>
      </article>
      <article  className={styles.mostrarBobinadoElegido}>
        {!bobinadoElegido ? (
          <h2 className={styles.h2}>Elegir Bobinado para mostrar</h2>
        ) : (
            <div>
              <section><h2 className={styles.h2}>Bobinado elegido</h2></section>
              <section>
              <table  className={styles.tablaBobinadoElegido}>
              <thead>
                <tr className={styles.th}>
                  <th>Propiedad</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Denominación</td>
                  <td>{bobinadoElegido.nombre_del_bobinado}</td>
                </tr>
                <tr>
                  <td>Diámetro</td>
                  <td>{bobinadoElegido.diametro}</td>
                </tr>
                <tr>
                  <td>Longitud</td>
                  <td>{bobinadoElegido.longitud}</td>
                </tr>
                <tr>
                  <td>Pines</td>
                  <td>{bobinadoElegido.pines ? 'Sí' : 'No'}</td>
                </tr>
                <tr>
                  <td>Usuario</td>
                  <td>{bobinadoElegido.usuario}</td>
                </tr>
              </tbody>
            </table>
              </section>
              <section>
                Botones
              </section>
              <section>
                Capas
              </section>
            </div>
        )}
      </article>
    </section>);
}

export default CrearMandril; 
*/

"use client";

import React, { useState, useEffect } from 'react';
import styles from '../css/crearMandril.module.css';
import BobinadoTable from '../components/BobinadoTable';
import CrearBobinadoButton from '../components/CrearBobinadoButton';
import MostrarBobinado from '../components/MostrarBobinado';

// Define la interfaz para los datos de cada bobinado
interface Bobinado {
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
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
        <h2 className={styles.h2}>Lista de bobinados</h2>
        {bobinados.length === 0 ? (
          <h2 className={styles.h2}>No hay bobinados para mostrar.</h2>
        ) : (
          <BobinadoTable bobinados={bobinados} onVerDetalles={handleVerDetalles} />
        )}
        <div className={styles.crearBobinado}>
        <CrearBobinadoButton onClick={handleCrearBobinado} />
        </div>
      </article>
      <article>
        <MostrarBobinado bobinadoElegido={bobinadoElegido} />
      </article>
    </section>
  );
}

export default CrearMandril;