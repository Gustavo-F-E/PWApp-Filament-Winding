import React from 'react';
import styles from '../css/crearMandril_component_ModalAñadirCapa.module.css';

interface NuevaCapa {
  longitud_util: number;
  espesor: number;
  coeficiente_rozamiento: number;
  pines: number;
}

interface ModalAñadirCapaProps {
  isOpen: boolean;
  nuevaCapa: NuevaCapa;
  setIsAddCapaModalOpen: (isOpen: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  agregarCapa: () => void;
}

const ModalAñadirCapa: React.FC<ModalAñadirCapaProps> = ({
  isOpen,
  nuevaCapa,
  setIsAddCapaModalOpen,
  handleInputChange,
  agregarCapa,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalAñadirCapa}>
      <div className={`${styles.modalContent}`}>
        <button
          className={styles.close}
          onClick={() => setIsAddCapaModalOpen(false)}
        >
          &times;
        </button>
        <h2>Añadir Nueva Capa</h2>
        <form>
          <input
            type="text"
            name="longitud_util"
            value={nuevaCapa.longitud_util}
            onChange={handleInputChange}
            placeholder="Longitud útil"
          />
          <input
            type="text"
            name="espesor"
            value={nuevaCapa.espesor}
            onChange={handleInputChange}
            placeholder="Espesor"
          />
          <input
            type="text"
            name="coeficiente_rozamiento"
            value={nuevaCapa.coeficiente_rozamiento}
            onChange={handleInputChange}
            placeholder="Coef. Rozamiento"
          />
          <input
            type="text"
            name="pines"
            value={nuevaCapa.pines}
            onChange={handleInputChange}
            placeholder="Pines"
          />
          <button type="button" onClick={agregarCapa}>
            Añadir Capa
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAñadirCapa;
