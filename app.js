const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const repository = require('./repository/repository');

app.post('/executar', async (req, res) => {
  const { code } = req.body;
  // Salva o código no repositório
  await repository.saveCode(code);
  // Verifica sintaxe
  const syntaxResult = await repository.checkSyntax(code);
  // Salva resultado no repositório
  await repository.saveResult(syntaxResult);
  res.json({ output: syntaxResult });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em localhost:${PORT}`);
});