import db from './bobinadosDDBB';
import { NextApiRequest, NextApiResponse } from 'next';
import { v1 as uuidv1 } from 'uuid';

export default function handlerBobinados(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Obtener todos los bobinados
      const rows = db.prepare('SELECT * FROM bobinados').all();
      res.status(200).json(rows);
    } else if (req.method === 'POST') {
      // Crear un nuevo bobinado
      const { nombre_del_bobinado, diametro, longitud, pines, usuario, espesor } = req.body;

      if (!nombre_del_bobinado || !diametro || !longitud || !pines) {
        return res.status(400).json({ message: 'Faltan datos requeridos.' });
      }

      const id = uuidv1();
      const fecha_creacion = new Date().toISOString();
      const fecha_ultima_modificacion = fecha_creacion;

      db.prepare(
        `INSERT INTO bobinados (id, nombre_del_bobinado, diametro, longitud, pines, usuario, fecha_creacion, fecha_ultima_modificacion, espesor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(id, nombre_del_bobinado, diametro, longitud, pines, usuario || null, fecha_creacion, fecha_ultima_modificacion, espesor || null);

      res.status(201).json({ message: 'Bobinado creado exitosamente.', id });
    } else if (req.method === 'PUT') {
      // Actualizar un bobinado existente
      const { id, nombre_del_bobinado, diametro, longitud, pines, usuario, espesor } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'El ID es requerido para actualizar un bobinado.' });
      }

      const fecha_ultima_modificacion = new Date().toISOString();

      db.prepare(
        `UPDATE bobinados
        SET nombre_del_bobinado = ?, diametro = ?, longitud = ?, pines = ?, usuario = ?, espesor = ?, fecha_ultima_modificacion = ?
        WHERE id = ?`
      ).run(nombre_del_bobinado, diametro, longitud, pines, usuario || null, espesor || null, fecha_ultima_modificacion, id);

      res.status(200).json({ message: 'Bobinado actualizado exitosamente.' });
    } else if (req.method === 'DELETE') {
      // Eliminar un bobinado
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'El ID es requerido para eliminar un bobinado.' });
      }

      db.prepare('DELETE FROM bobinados WHERE id = ?').run(id);
      res.status(200).json({ message: 'Bobinado eliminado exitosamente.' });
    } else {
      // Método no permitido
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}