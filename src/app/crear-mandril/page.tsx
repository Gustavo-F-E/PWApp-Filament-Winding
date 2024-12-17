// src/app/crear-mandril/page.tsx
import React from 'react';
import styles from './crearMandril.module.css';
import { useState, useEffect } from 'react';

// Define la interfaz para los datos de cada bobinado
interface Bobinado {
  id: number;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

//Función para obtener los datos del servidor 
async function fetchBobinados(): Promise<Bobinado[]> { const response = await fetch('/api/bobinados'); // URL corregida 
  if (!response.ok) { throw new Error('Error fetching Bobinados'); }
  return response.json();
}
export default function Home() {
  const [bobinados, setBobinados] = useState<Bobinado[]>([]); // Nombres de variables consistentes 
  useEffect(() => {
    fetchBobinados()
      .then(data => setBobinados(data))
      .catch(error => console.error('Error fetching Bobinados:', error));
  }, []);
  return (
    <div className={styles.container}>
      <h2>Lista de bobinados</h2> {bobinados.length === 0 ? (<p>No hay bobinados para mostrar.</p>) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Creación</th>
              <th>Última modificación</th>
            </tr>
          </thead>
          <tbody> {bobinados.map((bobinado) => (<tr key={bobinado.id}>
            <td>{bobinado.id}</td>
            <td>{bobinado.fecha_creacion}</td>
            <td>{bobinado.fecha_ultima_modificacion}</td>
          </tr>))}
          </tbody>
        </table>)}
    </div>);
}