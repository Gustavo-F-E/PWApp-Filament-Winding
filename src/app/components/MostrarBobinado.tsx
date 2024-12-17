import React from 'react';
import styles from '../css/MostrarBobinado.module.css';

interface Bobinado {
  nombre_del_bobinado: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
}

interface MostrarBobinadoProps {
  bobinadoElegido: Bobinado | null;
}

const MostrarBobinado: React.FC<MostrarBobinadoProps> = ({ bobinadoElegido }) => {
  if (!bobinadoElegido) {
    return <h2 className={styles.h2}>Elegir Bobinado para mostrar</h2>;
  }

  return (
    <div className={styles.mostrarBobinadoElegido}>
      <h2 className={styles.h2}>Bobinado elegido</h2>
      <table className={styles.tablaBobinadoElegido}>
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
    </div>
  );
};
export default MostrarBobinado;
