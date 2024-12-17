import React from 'react';
import styles from '../css/CrearBobinado.module.css';

interface CrearBobinadoButtonProps {
  onClick: () => void;
}

const CrearBobinadoButton: React.FC<CrearBobinadoButtonProps> = ({ onClick }) => (
  <div className={styles.crearBobinado}>
    <button onClick={onClick}>Crear Bobinado</button>
  </div>
);

export default CrearBobinadoButton;
