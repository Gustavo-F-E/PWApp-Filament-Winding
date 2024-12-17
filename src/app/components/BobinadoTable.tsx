import React from 'react';
import styles from '../css/BobinadoTable.module.css';

interface Bobinado {
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

interface BobinadoTableProps {
  bobinados: Bobinado[];
  onVerDetalles: (nombre: string) => void;
}

const BobinadoTable: React.FC<BobinadoTableProps> = ({ bobinados, onVerDetalles }) => (
  <table className={styles.tablaBobinados}>
    <thead>
      <tr className={styles.th}>
        <th>Denominación</th>
        <th>Creación</th>
        <th>Última modificación</th>
        <th>Detalles</th>
      </tr>
    </thead>
    <tbody>
      {bobinados.map((bobinado) => (
        <tr key={bobinado.nombre_del_bobinado}>
          <td>{bobinado.nombre_del_bobinado}</td>
          <td>{new Date(bobinado.fecha_creacion).toLocaleDateString('es-ES')}</td>
          <td>{new Date(bobinado.fecha_ultima_modificacion).toLocaleDateString('es-ES')}</td>
          <td>
            <button className={styles.verBobinados} onClick={() => onVerDetalles(bobinado.nombre_del_bobinado)}>Ver</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BobinadoTable;
