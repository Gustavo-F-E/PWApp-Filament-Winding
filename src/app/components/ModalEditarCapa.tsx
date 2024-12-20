import React from 'react';
import styles from '../css/crearMandril_component_ModalEditarCapa.module.css';

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

interface ModalEditarCapaProps {
  isOpen: boolean;
  capaSeleccionada: Capa | null;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setCapaSeleccionada: React.Dispatch<React.SetStateAction<Capa | null>>;
  actualizarCapa: () => void;
}

const ModalEditarCapa: React.FC<ModalEditarCapaProps> = ({
  isOpen,
  capaSeleccionada,
  setIsEditModalOpen,
  setCapaSeleccionada,
  actualizarCapa,
}) => {
  if (!isOpen || !capaSeleccionada) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCapaSeleccionada((prev) =>
      prev ? { ...prev, [name]: parseFloat(value) } : null
    );
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button
          className={styles.close}
          onClick={() => setIsEditModalOpen(false)}
        >
          &times;
        </button>
        <h2>Editar Capa</h2>
        <form>
          <input
            type="number"
            name="alfa_original"
            value={capaSeleccionada.alfa_original}
            onChange={handleInputChange}
            placeholder="Ángulo Original"
          />
          <input
            type="number"
            name="alfa_corregido"
            value={capaSeleccionada.alfa_corregido}
            onChange={handleInputChange}
            placeholder="Ángulo Corregido"
          />
          {/* Otros campos según sea necesario */}
          <button
            type="button"
            onClick={() => {
              console.log('Capa actualizada:', capaSeleccionada);
              actualizarCapa();
              setIsEditModalOpen(false);
            }}
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarCapa;
