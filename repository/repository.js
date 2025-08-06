const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('repository/database.sqlite')

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS codes (
  id INTEGER PRIMARY KEY,
  code TEXT,
  result TEXT
)`)

module.exports = {
  saveCode: (code) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO codes (id, code) VALUES (?, ?)', [1, code], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  getCode: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT code FROM codes WHERE id = ?', [1], (err, row) => {
        if (err) reject(err);
        else resolve(row ? String(row.code) : null);
      });
    });
  },

  saveResult: (result) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE codes SET result = ? WHERE id = (SELECT MAX(id) FROM codes)', [result], function (err) {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}