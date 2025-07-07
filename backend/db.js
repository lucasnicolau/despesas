
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./despesas.db');

// Criação da tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS despesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      valor REAL NOT NULL,
      descricao TEXT NOT NULL,
      categoria TEXT NOT NULL,
      data_registro TEXT DEFAULT (datetime('now','localtime'))
    )
  `);
});

module.exports = db;
