// db/connection.js
/*import Database from 'better-sqlite3';
const db = new Database('./bobinados.db', { verbose: console.log }); // Ruta a tu base de datos SQLite

export default db;*/

import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'pages/api/crearMandril/bobinados.db');
const db = new Database(dbPath, { verbose: console.log });

export default db;