/*import db from '../../../DDBB/bobinados';
import db from './bobinadosDDBB';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Consulta a la base de datos
      const rows = db.prepare('SELECT * FROM capas').all();

      // Enviar los datos como respuesta JSON
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}*/

import db from './bobinadosDDBB';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Obtenemos el parámetro 'nombre' de la query string
      const { nombre } = req.query;

      // Si no se recibe un nombre de bobinado, devolvemos todas las capas
      let query = 'SELECT * FROM capas';
      let params: string[] = [];

      if (nombre) {
        // Verifica que 'nombre' sea un string
        if (typeof nombre === 'string') {
          query += ' WHERE nombre = ?';
          params = [nombre]; // Ahora es seguro asignar 'nombre' a 'params'
        }
      }

      // Realizamos la consulta a la base de datos con o sin el filtro
      const rows = db.prepare(query).all(...params);

      // Enviar las capas filtradas como respuesta JSON
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
