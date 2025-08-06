const express = require('express')
const app = express()
const PORT = 3000;

app.use(express.static('public'))
app.use(express.json());

const repository = require('./repository/repository')
const codechecker = require('./modules/codechecker')


app.post('/executar', async (req, res) => {
  const { code } = req.body
  // Salva o código no repositório
  await repository.saveCode(code)
  // Verifica sintaxe
  const syntaxResult = await codechecker.checkSyntax()
  // Salva resultado no repositório
  await repository.saveResult(syntaxResult)
  res.json({ output: syntaxResult })
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em localhost:${PORT}`)
})