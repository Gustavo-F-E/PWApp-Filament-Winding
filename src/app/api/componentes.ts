/*import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Configura la conexión con SQLite
async function openDB() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await openDB();

  if (req.method === 'GET') {
    // Obtener datos
    const componentes = await db.all('SELECT * FROM componentes');
    res.status(200).json(componentes);
  } else if (req.method === 'POST') {
    // Agregar un nuevo registro
    const { nombre, diametro, longitud, pines } = req.body;
    if (!nombre || !diametro || !longitud || !pines) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    await db.run(
      'INSERT INTO componentes (nombre, diametro, longitud, pines) VALUES (?, ?, ?, ?)',
      [nombre, diametro, longitud, pines]
    );
    res.status(201).json({ message: 'Componente agregado exitosamente' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
*/