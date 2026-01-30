import React, { useState } from 'react';
import styles from '../css/crearMandril_component_MostrarCapas.module.css';
/*import Image from 'next/image'; // Asegúrate de importar el componente Image*/
import ModalVerPatron from './ModalVerPatron';
import ModalEditarCapa from './ModalEditarCapa';
import ModalEliminarCapa from './ModalEliminarCapa';
import ModalAñadirCapa from './ModalAñadirCapa';

// Interfaz para las propiedades de la capa
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

interface Bobinado {
  id: string;           // en lugar de id_bobinado
  nombre_del_bobinado: string;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
  diametro: number;
  longitud: number;
  pines: boolean;
  usuario: string;
  espesor: number;
  capas: Capa[];
}

interface MostrarCapasProps {
  bobinadoElegido: Bobinado | null;
}




const MostrarCapas: React.FC<MostrarCapasProps> = ({ bobinadoElegido }) => {
  const [isAddCapaModalOpen, setIsAddCapaModalOpen] = useState(false);
  const [isViewPatronModalOpen, setIsViewPatronModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [capaSeleccionada, setCapaSeleccionada] = useState<Capa | null>(null);
  const [patrones, setPatrones] = useState<Patron[]>([]);
  const [loading, setLoading] = useState(false);

  const [nuevaCapa, setNuevaCapa] = useState({
    usuario: '',
    filename2: '',
    diametro_mandril: 0,
    longitud_util: 0,
    espesor: 0,
    coeficiente_rozamiento: 0,
    pines: 0,
    alfa_original: 0,
    ancho: 0,
    exceso_de_resina: 0,
    corregir_angulo: 0,
    velocidad_de_alimentacion: 0,
    alfa_corregido: 0,
    ancho_eff: 0,
    NP: 0,
    patron_elegido: 0,
    orden_del_patron_elegido: 0,
    PTR: 0,
    Paso: 0,
    Dcco: 0,
  });

  /*const [bobinado, setBobinado] = useState({
    capas: [],
    usuario: '',
    longitud_util: 0,
    coeficiente_rozamiento: 0,
    pines: 0,
  });*/

  const calcularOrdenYDiametro = () => {
    if (!bobinadoElegido || !bobinadoElegido.capas) {
      return { orden_capa: 0, diametro_mandril: 0 }; // Manejo de caso cuando bobinadoElegido es null o no tiene capas
    }

    const orden_capa = bobinadoElegido.capas.length + 1; // Se basa en la cantidad de capas
    const diametro_mandril = bobinadoElegido.capas.length
      ? (bobinadoElegido.capas[bobinadoElegido.capas.length - 1]?.diametro_mandril || 0) + nuevaCapa.espesor
      : 0; // Si no hay capas, el valor es 0, sino se toma el último diametro y se le agrega el espesor

    return { orden_capa, diametro_mandril };
  };

  // Función para manejar el cambio de los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    import('../../utils/validation').then(({ handleNumericChangeValidation }) => {
      handleNumericChangeValidation(e, (msg) => alert(msg));
    });
    const { name, value } = e.target;
    setNuevaCapa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para enviar los datos del formulario al backend
  const agregarCapa = async () => {
    const { orden_capa, diametro_mandril } = calcularOrdenYDiametro();

    const nuevaCapaData = {
      ...nuevaCapa,
      orden_capa,
      diametro_mandril,
      id_bobinado: bobinadoElegido ? bobinadoElegido.id : undefined,
    };

    // Asegúrate de que los datos se envíen correctamente al backend
    console.log('Nueva capa:', nuevaCapaData);
    // Aquí iría la lógica para enviar los datos
  };
  // Handler para seleccionar una capa
  const handleSelectCapa = (capa: Capa) => {
    setCapaSeleccionada(capa); // Establece la capa seleccionada
    setIsEditModalOpen(true); // Abre el modal de edición
  };

  const actualizarCapa = async () => {
    if (capaSeleccionada) {
      try {
        const response = await fetch('/api/crearMandril/capas', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capaSeleccionada),
        });
        if (response.ok) {
          console.log('Capa actualizada correctamente');
        } else {
          console.error('Error al actualizar la capa');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };

  const eliminarCapa = async () => {
    if (capaSeleccionada) {
      try {
        const response = await fetch(`/api/eliminarCapa/${capaSeleccionada.id_bobinado}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('Capa eliminada correctamente');
          // Refrescar datos si es necesario
        } else {
          console.error('Error al eliminar la capa');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };


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
        setIsViewPatronModalOpen(true); // Abre el modal de "Ver Patrón"
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
              <tr key={capa.id} onClick={() => handleSelectCapa(capa)}> {/* Llama al handler al hacer clic */}
                <td>{index + 1}</td>
                <td>{capa.alfa_original}</td>
                <td>{capa.alfa_corregido}</td>
                <td>{capa.velocidad_de_alimentacion}</td>
                <td>{capa.ancho}</td>
                <td>{capa.ancho_eff.toFixed(2)}</td>
                <td>{capa.NP}</td>
                <td>{capa.patron_elegido}</td>
                <td><button className={styles.verPatron} onClick={() => fetchPatrones(capa.patron_elegido, capa.NP)}>Ver Patron</button></td>
                <td>
                  <button
                    className={styles.editarCapa}
                    onClick={() => {
                      setCapaSeleccionada(capa);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                </td>
                <td>
                  <button
                    className={styles.borrarCapa}
                    onClick={() => {
                      setCapaSeleccionada(capa);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.nuevaCapa}><button onClick={() => setIsAddCapaModalOpen(true)}>Añadir Capa</button></div>

      {/* Modal para ver patrones */}
      {isViewPatronModalOpen && (
        <ModalVerPatron
          patrones={patrones}
          loading={loading}
          onClose={() => setIsViewPatronModalOpen(false)}
        />
      )}
      {/* Modal para editar capa */}
      {isEditModalOpen && capaSeleccionada && (
        <ModalEditarCapa
          isOpen={isEditModalOpen}
          capaSeleccionada={capaSeleccionada}
          setIsEditModalOpen={setIsEditModalOpen}
          setCapaSeleccionada={setCapaSeleccionada}
          actualizarCapa={actualizarCapa}
        />
      )}
      {/* Modal para eliminar la capa */}
      {isDeleteModalOpen && capaSeleccionada && (
        <ModalEliminarCapa
          isOpen={isDeleteModalOpen}
          capaSeleccionada={capaSeleccionada}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          eliminarCapa={eliminarCapa}
        />
      )}


      {/* Modal con formulario para añadir capa */}
      {isAddCapaModalOpen && (
        <ModalAñadirCapa
          isOpen={isAddCapaModalOpen}
          nuevaCapa={nuevaCapa}
          setIsAddCapaModalOpen={setIsAddCapaModalOpen}
          handleInputChange={handleInputChange}
          agregarCapa={agregarCapa}
        />
      )}
    </div>
  );
};

export default MostrarCapas;
