// db/connection.js
import Database from 'better-sqlite3';
const db = new Database('./bobinados.db', { verbose: console.log }); // Ruta a tu base de datos SQLite

export default db;