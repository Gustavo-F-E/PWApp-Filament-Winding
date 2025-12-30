import db from './bobinadosDDBB';
import { NextApiRequest, NextApiResponse } from 'next';
import { v1 as uuidv1 } from 'uuid'; // Importamos la función para generar UUID

function handlerCapas(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Obtenemos el parámetro 'nombre' de la query string
      const { id_bobinado } = req.query;

      let query = 'SELECT * FROM capas';
      let params: string[] = [];

      if (id_bobinado) {
        if (typeof id_bobinado === 'string') {
          query += ' WHERE id_bobinado = ?';
          params = [id_bobinado];
        }
      }

      const rows = db.prepare(query).all(...params);
      res.status(200).json(rows);
    } 
    else if (req.method === 'POST') {
      const {
        usuario,
        id_bobinado,
        orden_capa,
        filename2,
        diametro_mandril,
        longitud_util,
        espesor,
        coeficiente_rozamiento,
        pines,
        alfa_original,
        ancho,
        exceso_de_resina,
        corregir_angulo,
        velocidad_de_alimentacion,
        alfa_corregido,
        ancho_eff,
        NP,
        patron_elegido,
        orden_del_patron_elegido,
        PTR,
        Paso,
        Dcco,
      } = req.body;

      // Generar un UUID para el nuevo registro
      const id = uuidv1();

      const query = `
        INSERT INTO capas (
          id, usuario, id_bobinado, orden_capa, filename2, diametro_mandril, longitud_util, espesor,
          coeficiente_rozamiento, pines, alfa_original, ancho, exceso_de_resina,
          corregir_angulo, velocidad_de_alimentacion, alfa_corregido, ancho_eff,
          NP, patron_elegido, orden_del_patron_elegido, PTR, Paso, Dcco
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `;
      db.prepare(query).run(
        id, usuario, id_bobinado, orden_capa, filename2, diametro_mandril, longitud_util, espesor,
        coeficiente_rozamiento, pines, alfa_original, ancho, exceso_de_resina,
        corregir_angulo, velocidad_de_alimentacion, alfa_corregido, ancho_eff,
        NP, patron_elegido, orden_del_patron_elegido, PTR, Paso, Dcco
      );
      res.status(201).json({ message: 'Capa creada exitosamente' });
    } 
    else if (req.method === 'PUT') {
      const { id } = req.query;
      const {
        usuario,
        id_bobinado,
        orden_capa,
        filename2,
        diametro_mandril,
        longitud_util,
        espesor,
        coeficiente_rozamiento,
        pines,
        alfa_original,
        ancho,
        exceso_de_resina,
        corregir_angulo,
        velocidad_de_alimentacion,
        alfa_corregido,
        ancho_eff,
        NP,
        patron_elegido,
        orden_del_patron_elegido,
        PTR,
        Paso,
        Dcco,
      } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'El ID es obligatorio para actualizar una capa' });
      }

      const query = `
        UPDATE capas SET 
          usuario = ?, id_bobinado = ?, orden_capa = ?, filename2 = ?, diametro_mandril = ?, longitud_util = ?, espesor = ?, 
          coeficiente_rozamiento = ?, pines = ?, alfa_original = ?, ancho = ?, exceso_de_resina = ?, 
          corregir_angulo = ?, velocidad_de_alimentacion = ?, alfa_corregido = ?, ancho_eff = ?, NP = ?, 
          patron_elegido = ?, orden_del_patron_elegido = ?, PTR = ?, Paso = ?, Dcco = ?
        WHERE id = ?
      `;
      db.prepare(query).run(
        usuario, id_bobinado, orden_capa, filename2, diametro_mandril, longitud_util, espesor,
        coeficiente_rozamiento, pines, alfa_original, ancho, exceso_de_resina,
        corregir_angulo, velocidad_de_alimentacion, alfa_corregido, ancho_eff,
        NP, patron_elegido, orden_del_patron_elegido, PTR, Paso, Dcco, id
      );
      res.status(200).json({ message: 'Capa actualizada exitosamente' });
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'El ID es obligatorio para eliminar una capa' });
      }

      const query = 'DELETE FROM capas WHERE id = ?';
      db.prepare(query).run(id);
      res.status(200).json({ message: 'Capa eliminada exitosamente' });
    } 
    else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error en el handler:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default handlerCapas;