const repository = require('../repository/repository')

module.exports = {
    checkSyntax: async () => {
        const code = await repository.getCode()
        if (code === '') return 'Campo de código vazio!'

        let listOfVariables = []
        const arrayOfLines = code.split('\n');
        let consoleResponse = '';
        // Verificação linha à linha
        for (let i = 0; i < arrayOfLines.length; i++) {
            let line = String(arrayOfLines[i].trim());

            // Testes de sintaxe simples
            if (line === '') continue
            if (line.startsWith('//')) continue
            if (!line.endsWith(';')) {
                consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta ponto e vírgula no final.\n`
                break
            }

            // Testes de sintaxe de variáveis
            if (line.startsWith('variavel')) {
                const listOfTerms = line.split(' ')
                if (!((listOfTerms[1] == 'inteiro' || listOfTerms[1] == 'texto') && listOfTerms[3] == '=')) {
                    consoleResponse += `Erro de sintaxe na linha ${i + 1}: estrutura de declaração de variável incorreta.\n`
                } else {
                    const variableName = listOfTerms[2]
                    let variableValue = ''

                    for (let i = 4; i < listOfTerms.length; i++) { // Traz a estrutura do valor da variável de volta
                        variableValue += listOfTerms[i]
                        if (i < listOfTerms.length - 1) variableValue += ' '
                    }
                    if (/[a-zA-Z]/.test(variableValue)) variableValue = variableValue.substring(1, variableValue.length - 2)
                    else variableValue = variableValue.substring(0, variableValue.length - 1).trim()

                    // Verifica se começa com caracteres inválidos
                    if (/^\d/.test(variableName)) {
                        consoleResponse += `Erro de sintaxe na linha ${i + 1}: o nome da variável não pode começar com um número.\n`
                        break
                    } else {
                        if (listOfVariables.includes(variableName)) { // Verifica se a variável já foi declarada
                            consoleResponse += `Erro de sintaxe na linha ${i + 1}: variável '${variableName}' já declarada.\n`
                            break
                        } else {
                            const type = listOfTerms[1]
                            listOfVariables.push({ type, variableName, variableValue })
                            console.log(listOfVariables)
                        }
                    }
                }
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
                    const displayInterval = hasInitialQuotes && hasFinalQuotes ? line.replaceAll('"', '').substring(6, line.length - 4) : line.substring(6, line.length - 2).trim()
                    const hasNumbersAndSimbols = /^[0-9+\-*/]+$/.test(displayInterval)
                    if ((hasInitialQuotes && hasFinalQuotes) ) {
                        consoleResponse += `${displayInterval}\n`;
                        continue
                    } else if (hasInitialQuotes && !hasFinalQuotes) {
                        consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta aspas finais.\n`
                        break
                    } else if (!hasInitialQuotes && hasFinalQuotes) {
                        consoleResponse += `Erro de sintaxe na linha ${i + 1}: falta aspas iniciais.\n`
                        break
                    } else {
                        if (hasNumbersAndSimbols) {
                            const { evaluate } = require('mathjs')
                            consoleResponse += `${evaluate(displayInterval)}\n`
                            continue
                        }
                        // Verifica se é uma variável e exibe o valor
                    }
                    consoleResponse += '\n'
                }
            }

            consoleResponse += `Erro generico de sintaxe na linha ${i + 1}: erro não esperado pelo compilador.\n`
        }
        return consoleResponse
    }
}