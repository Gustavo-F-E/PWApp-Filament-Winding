import React from 'react';
import styles from '../css/crearMandril_component_ModalEliminarCapa.module.css';

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

interface ModalEliminarCapaProps {
  isOpen: boolean;
  capaSeleccionada: Capa | null;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  eliminarCapa: () => void;
}

const ModalEliminarCapa: React.FC<ModalEliminarCapaProps> = ({
  isOpen,
  capaSeleccionada,
  setIsDeleteModalOpen,
  eliminarCapa,
}) => {
  if (!isOpen || !capaSeleccionada) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button
          className={styles.close}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          &times;
        </button>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta capa?</p>
        <button
          onClick={() => {
            console.log('Capa eliminada:', capaSeleccionada);
            eliminarCapa();
            setIsDeleteModalOpen(false);
          }}
        >
          Sí, eliminar
        </button>
        <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEliminarCapa;
