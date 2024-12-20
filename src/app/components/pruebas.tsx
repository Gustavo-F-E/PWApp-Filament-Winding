import React, { useState } from 'react';
import styles from '../css/crearMandril_component_MostrarCapas.module.css';
import Image from 'next/image';

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

// Props para el componente MostrarCapas
interface MostrarCapasProps {
  bobinadoElegido: { capas: Capa[] } | null;
}

const MostrarCapas: React.FC<MostrarCapasProps> = ({ bobinadoElegido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patrones, setPatrones] = useState<Patron[]>([]);
  const [loading, setLoading] = useState(false);

  const [nuevaCapa, setNuevaCapa] = useState({
    usuario: '',
    diametro_mandril: 0,
    longitud_util: 0,
    espesor: 0,
    coeficiente_rozamiento: 0,
    pines: 0,
    alfa_original: 0,
    ancho: 0,
    // Otros campos según la base de datos
  });

  const [bobinadoElegido] = useState({
    capas: [{ /* datos ejemplo */ }],
    usuario: 'UsuarioEjemplo', // Ejemplo, asegúrate de que estos valores estén en tu estado
    longitud_util: 100,  // Ejemplo
    coeficiente_rozamiento: 0.5, // Ejemplo
    pines: 10,  // Ejemplo
  });

  // Función para calcular el "orden_capa" y el "diametro_mandril"
  const calcularOrdenYDiametro = () => {
    const orden_capa = bobinadoElegido.capas.length + 1; // Se basa en la cantidad de capas
    const diametro_mandril = bobinadoElegido.capas.length
      ? bobinadoElegido.capas[bobinadoElegido.capas.length - 1].diametro_mandril + nuevaCapa.espesor
      : 0; // Si no hay capas, el valor es 0, sino se toma el último diametro y se le agrega el espesor
    return { orden_capa, diametro_mandril };
  };

  // Función para manejar el cambio de los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      id_bobinado: bobinadoElegido.id_bobinado,
    };

    try {
      const response = await fetch('/api/capas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCapaData),
      });

      if (response.ok) {
        // Aquí puedes manejar la respuesta exitosa, por ejemplo, cerrar el formulario
        console.log('Capa añadida con éxito');
      } else {
        console.error('Error al añadir capa');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div className={styles.mostrarCapas}>
      <div>
        <h2 className={styles.h2}>Capas del Bobinado Elegido</h2>
      </div>
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
                <td>
                  <button className={styles.verPatron}>Ver Patrón</button>
                </td>
                <td><button className={styles.editarCapa}>Editar</button></td>
                <td><button className={styles.borrarCapa}>Borrar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario para añadir nueva capa */}
      <div className={styles.nuevaCapa}>
        <button onClick={() => setIsModalOpen(true)}>Añadir Capa</button>
      </div>

      {/* Modal con formulario para añadir capa */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent}`}>
            <button className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2>Añadir Nueva Capa</h2>
            <form>
              <input
                type="number"
                name="longitud_util"
                value={nuevaCapa.longitud_util}
                onChange={handleInputChange}
                placeholder="Longitud útil"
              />
              <input
                type="number"
                name="espesor"
                value={nuevaCapa.espesor}
                onChange={handleInputChange}
                placeholder="Espesor"
              />
              <input
                type="number"
                name="coeficiente_rozamiento"
                value={nuevaCapa.coeficiente_rozamiento}
                onChange={handleInputChange}
                placeholder="Coef. Rozamiento"
              />
              <input
                type="number"
                name="pines"
                value={nuevaCapa.pines}
                onChange={handleInputChange}
                placeholder="Pines"
              />
              <button type="button" onClick={agregarCapa}>Añadir Capa</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MostrarCapas;
