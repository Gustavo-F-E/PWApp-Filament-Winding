/*import db from '../../../DDBB/bobinados';*/
import db from './bobinadosDDBB';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Consulta a la base de datos
      const rows = db.prepare('SELECT id, fecha_creacion, fecha_ultima_modificacion FROM bobinados').all();

      // Enviar los datos como respuesta JSON
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
