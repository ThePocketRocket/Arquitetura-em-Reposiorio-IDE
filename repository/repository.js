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
      db.run('INSERT INTO codes (code) VALUES (?)', [code], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  // Precisa ser mudado para o módulo correto
  checkSyntax: async (code) => {
    if (code === '') return 'Campo de código vazio!'

    const arrayOfLines = code.split('\n');
    let consoleResponse = '';
    for (let i = 0; i < arrayOfLines.length; i++) {
      let line = String(arrayOfLines[i].trim());

      // Testes de sintaxe simples
      if (line === '') continue
      if (line.startsWith('//')) continue
      if (!line.endsWith(';')) {
        consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta ponto e vírgula no final.\n`;
        break
      }

      // Testes de sitaxe do comando exibe()
      if (line.startsWith('exibe')) {
        if (line[5] !== '(' || line[line.length - 2] !== ')') {
          consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta parêntese de abertura ou fechamento.\n`
          break
        } else {
          // Verifica se será exibido texto, variavel ou expressão matemática
          const hasInitialQuotes = line[6] === '"'
          const hasFinalQuotes = line[line.length - 3] === '"'
          const displayInterval = hasInitialQuotes && hasFinalQuotes? line.replaceAll('"', '').substring(6, line.length - 4): line.substring(6, line.length - 2).trim();
          const hasNumbersAndSimbols = /^[0-9+\-*/]+$/.test(displayInterval)
          if (hasInitialQuotes && hasFinalQuotes) {
            consoleResponse += `${displayInterval}\n`;
            continue
          } else if (hasInitialQuotes && !hasFinalQuotes) {
            consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta aspas finais.\n`;
            break
          } else if (!hasInitialQuotes && hasFinalQuotes) {
            consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta aspas iniciais.\n`;
            break
          } else {
            if (hasNumbersAndSimbols) {
              const {evaluate} = require('mathjs')
              consoleResponse += `${evaluate(displayInterval)}\n`
              continue
            }
            // Verifica se é uma variável e exibe o valor
          }
          consoleResponse += '\n'
        }
      }
    }
    return consoleResponse
},

  saveResult: (result) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE codes SET result = ? WHERE id = (SELECT MAX(id) FROM codes)', [result], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};