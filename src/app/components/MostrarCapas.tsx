import React, { useState } from 'react';
import styles from '../css/crearMandril_component_MostrarCapas.module.css';
import Image from 'next/image'; // Asegúrate de importar el componente Image

// Interfaz para las propiedades de la capa
interface Capa {
  alfa_original: number;
  alfa_corregido: number;
  velocidad_de_alimentacion: number;
  ancho: number;
  ancho_eff: number;
  NP: number;
  patron_elegido: number;
}

// Interfaz para los datos de un patrón
interface Patron {
  NP: number;
  patron_numero: number;
  Paso: number;
  Ptr: number;
  Dcco: number;
  Orden_del_patron: string;
  nombre_archivo: string;
}

// Props para el componente MostrarCapas
interface MostrarCapasProps {
  bobinadoElegido: { capas: Capa[] } | null;
}

const MostrarCapas: React.FC<MostrarCapasProps> = ({ bobinadoElegido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patrones, setPatrones] = useState<Patron[]>([]);
  const [loading, setLoading] = useState(false);

  if (!bobinadoElegido) {
    return <h2 style={{ display: 'none' }}>Crear/Elegir Bobinado</h2>;
  }

  const fetchPatrones = async (patronElegido: number, NP: number) => {
    console.log("Botón clickeado, patrón elegido:", patronElegido, "NP:", NP); // Verificar que el botón funcione
    setLoading(true);
    try {
      const response = await fetch(`/api/crearMandril/patrones?patronElegido=${patronElegido}&NP=${NP}`);
      if (response.ok) {
        const data = await response.json();
        setPatrones(data);
        setIsModalOpen(true); // Abre el modal
      } else {
        console.error('Error fetching patrones');
      }
    } catch (error) {
      console.error('Error fetching patrones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mostrarCapas}>
      <div><h2 className={styles.h2}>Capas del Bobinado Elegido</h2></div>
      <div>
        <table className={styles.tablaCapas}>
          <thead>
            <tr className={styles.th}>
              <th>#</th>
              <th>Ángulo</th>
              <th>Ángulo Corr.</th>
              <th>Vel. de Alim.</th>
              <th>Ancho</th>
              <th>Ancho Ef.</th>
              <th>NP</th>
              <th>Patrón Elegido</th>
              <th>Prop. del Patrón</th>
              <th>Editar</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {bobinadoElegido.capas.map((capa, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{capa.alfa_original}</td>
                <td>{capa.alfa_corregido}</td>
                <td>{capa.velocidad_de_alimentacion}</td>
                <td>{capa.ancho}</td>
                <td>{capa.ancho_eff.toFixed(2)}</td>
                <td>{capa.NP}</td>
                <td>{capa.patron_elegido}</td>
                <td><button className={styles.verPatron} onClick={() => fetchPatrones(capa.patron_elegido, capa.NP)}>Ver Patron</button></td>
                <td><button className={styles.editarCapa}>Editar</button></td>
                <td><button className={styles.borrarCapa}>Borrar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.nuevaCapa}><button>Añadir Capa</button></div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={`${ styles.modalContent } ${ styles.h2 }`}>
            <button className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</button>
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
                  <div>{patrones.map((patron, index) => (
                    <Image  className={styles.imagenModal}
                        key={index}
                        src={`/images/patrones/${patron.nombre_archivo}`} // Ajusta la ruta según sea necesario
                        alt={`Patrón ${patron.patron_numero}`} 
                        width={500}  // Relación de aspecto (no tamaño final)
                        height={300} // Relación de aspecto (no tamaño final)
                        layout="responsive" // Escalado de la imagen
                      />))}
                  </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MostrarCapas;
