// Atualiza os números das linhas no editor
const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('line-numbers');

function updateLineNumbers() {
  const lines = editor.value.split('\n').length;
  let html = '';
  for (let i = 1; i <= lines; i++) {
    html += i + '\n';
  }
  lineNumbers.innerHTML = html;
  
  lineNumbers.scrollTop = editor.scrollTop; // Sincroniza o eixo Y do número da linha com o eixo Y do editor
}
// Atualiza ao digitar ou colar
editor.addEventListener('input', updateLineNumbers);
// Atualiza ao rolar o editor
editor.addEventListener('scroll', () => {
  lineNumbers.scrollTop = editor.scrollTop;
});
// Atualiza ao inicializar a página
updateLineNumbers();

/** ====================================================================== */

document.getElementById('run-btn').addEventListener('click', async () => {
  const code = editor.value;
  const response = await fetch('/executar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  const result = await response.json();
  document.getElementById('console').textContent = result.output;
});