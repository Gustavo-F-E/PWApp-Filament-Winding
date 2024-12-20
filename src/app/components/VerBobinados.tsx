import React from 'react';
import styles from '../css/crearMandril_component_VerBobinados.module.css';

interface Bobinado {
  id: string;
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

interface VerBobinadosProps {
  bobinados: Bobinado[];
  onVerDetalles: (id: string) => void;
  onCrearBobinado: () => void;
}

const VerBobinados: React.FC<VerBobinadosProps> = ({ bobinados, onVerDetalles, onCrearBobinado }) => {
  const mostrarBobinados = bobinados.length > 0;

  const BobinadoTable: React.FC<{ bobinados: Bobinado[]; onVerDetalles: (id: string) => void }> = ({ bobinados, onVerDetalles }) => (
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
          <tr key={bobinado.id}>
            <td>{bobinado.nombre_del_bobinado}</td>
            <td>{new Date(bobinado.fecha_creacion).toLocaleDateString('es-ES')}</td>
            <td>{new Date(bobinado.fecha_ultima_modificacion).toLocaleDateString('es-ES')}</td>
            <td>
              <button className={styles.verBobinados} onClick={() => onVerDetalles(bobinado.id)}>Ver</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const CrearBobinadoButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className={styles.crearBobinado}>
      <button onClick={onClick}>Crear Bobinado</button>
    </div>
  );

  return (
    <div>
      <h2 className={styles.h2}>Lista de bobinados</h2>
      {mostrarBobinados && (
        <BobinadoTable bobinados={bobinados} onVerDetalles={onVerDetalles} />
      )}
      {!mostrarBobinados && (
        <h3 className={styles.h3}>No hay bobinados para mostrar.</h3>
      )}
      <div className={styles.crearBobinado}>
        <CrearBobinadoButton onClick={onCrearBobinado} />
      </div>
    </div>
  );
};

export default VerBobinados;