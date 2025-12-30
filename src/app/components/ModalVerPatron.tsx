// components/ModalVerPatron.tsx
import React from 'react';
import styles from '../css/crearMandril_component_ModalVerPatron.module.css';
import Image from 'next/image';

interface Patron {
  NP: number;
  patron_numero: number;
  Paso: number;
  Ptr: number;
  Dcco: number;
  Orden_del_patron: string;
  nombre_archivo: string;
}

interface ModalVerPatronProps {
  patrones: Patron[];
  loading: boolean;
  onClose: () => void;
}

const ModalVerPatron: React.FC<ModalVerPatronProps> = ({ patrones, loading, onClose }) => (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <button className={styles.close} onClick={onClose}>&times;</button>
      <h2>Detalles del Patrón</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={styles.contenedorModal}>
          <div>
            <table className={styles.modalTable}>
              <thead>
                <tr>
                  <th>Propiedad</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {patrones.map((patron, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>NP</td>
                      <td>{patron.NP}</td>
                    </tr>
                    <tr>
                      <td>Patrón Número</td>
                      <td>{patron.patron_numero}</td>
                    </tr>
                    <tr>
                      <td>Paso</td>
                      <td>{patron.Paso}</td>
                    </tr>
                    <tr>
                      <td>Ptr</td>
                      <td>{patron.Ptr}</td>
                    </tr>
                    <tr>
                      <td>Dcco</td>
                      <td>{patron.Dcco}</td>
                    </tr>
                    <tr>
                      <td>Orden del Patrón</td>
                      <td>{patron.Orden_del_patron}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {patrones.map((patron, index) => (
              <Image
                key={index}
                src={`/images/patrones/${patron.nombre_archivo}`}
                alt={`Patrón ${index + 1}`}
                width={200}
                height={200}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ModalVerPatron;
