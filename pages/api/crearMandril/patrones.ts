import { NextApiRequest, NextApiResponse } from 'next';
import db from './bobinadosDDBB'; // Asegúrate de que el path esté correcto

export default async function handlerGetPatrones(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { patronElegido, NP} = req.query;

    if (!patronElegido || !NP) {
      return res.status(400).json({ error: 'Falta el parámetro patronElegido' });
    }

    // Usar la función all de better-sqlite3 correctamente
    try {
      const query = `
        SELECT NP, patron_numero, Paso, Ptr, Dcco, Orden_del_patron, nombre_archivo
        FROM listado_de_patrones
        WHERE patron_numero = ? AND NP = ?`;

      // Cambiar el uso del callback por el valor devuelto directamente
      const rows = db.prepare(query).all(Number(patronElegido), Number(NP));

      res.status(200).json(rows);
    } catch (err: unknown) { // Especifica el tipo de 'err' como unknown
      if (err instanceof Error) { // Verifica si 'err' es una instancia de Error
        res.status(500).json({ error: 'Error en la consulta a la base de datos', details: err.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' }); // Manejo de errores desconocidos
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
