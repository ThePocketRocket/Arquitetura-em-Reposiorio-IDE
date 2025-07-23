const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('repository/database.sqlite');

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT,
  result TEXT
)`);

module.exports = {
  saveCode: (code) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO codes (code) VALUES (?)', [code], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  checkSyntax: async (code) => {
    // Simulação de verificação de sintaxe
    if (code.includes('erro')) {
      return 'Erro de sintaxe encontrado!';
    }
    return 'Código válido!';
  },

  saveResult: (result) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE codes SET result = ? WHERE id = (SELECT MAX(id) FROM codes)', [result], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};