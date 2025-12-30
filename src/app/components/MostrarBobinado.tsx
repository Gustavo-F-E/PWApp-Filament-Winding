import React from 'react';
import styles from '../css/crearMandril_component_MostrarBobinado.module.css';

interface Bobinado {
  nombre_del_bobinado: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
  espesor: number;
}

interface MostrarBobinadoProps {
  bobinadoElegido: Bobinado | null;
}

const MostrarBobinado: React.FC<MostrarBobinadoProps> = ({ bobinadoElegido }) => {
  if (!bobinadoElegido) {
    return <h2 style={{ display: 'none' }}>Crear/Elegir Bobinado</h2>;
  }

  return (
    <div className={styles.mostrarBobinadoElegido}>
      <div className={styles.h2}><h2>Bobinado <span className={styles.resaltar}>&quot;{bobinadoElegido.nombre_del_bobinado}&quot;</span></h2></div>
      <div className={styles.tablaBobinadoElegido}>
        <table>
          <thead>
            <tr className={styles.th}>
              <th>Propiedad</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Usuario</td>
              <td>{bobinadoElegido.usuario}</td>
            </tr>
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
              <td>Espesor de capa</td>
              <td>{bobinadoElegido.espesor}</td>
            </tr>
          </tbody>
          </table>
        </div>
      <div className={styles.editarBobinado}><button>Editar</button></div>
      <div className={styles.borrarBobinado}><button>Borrar</button></div>
    </div>
  );
};
export default MostrarBobinado;
