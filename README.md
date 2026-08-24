# project1-2026b-renatasfon
# Projeto: Remake de aplicação web simples


<img width="1350" height="566" alt="exemplo2" src="https://github.com/user-attachments/assets/51c9017f-9efc-4407-844f-4f3b9d55ebdc" />



## Acesso

https://elc1090.github.io/project1-2026b-renatasfon/


## Desenvolvedor(a)
Renata Fonseca
Sistemas de Informação



## App original

### Links

- Acesso: https://thebarunkumar.github.io/my-notes-app/
- Repositório: https://github.com/thebarunkumar/my-notes-app

### Descrição

Substitua este texto por uma descrição do app original. Inclua observações sobre sua autoria, conteúdo, aparência e código.

## Demanda do(a) cliente

### Cliente
Miguel Miron Silva

### Demanda
 	
- Suporte a markdown e sistemas de tags, marcação de cor de borda, editor de negrito/itálico/listas
- Opção de exportar notas individuais e/ou todo as notas
- Lixeira de notas, com opção de desfazer notas deletadas, ao invés de deletar a nota sem possibilidade de revertê-lo
- Capacidade de arrastar a reordenar notas
- Opção de fixar notas
- Folder de notas

## Desenvolvimento

### Processo

O projeto original apresentava uma estrutura simples, com funcionalidades básicas de criação de notas, incluindo título, conteúdo, salvamento e exclusão permanente. Todas essas operações eram realizadas diretamente pelo navegador.

Como eu ainda não havia trabalhado com JavaScript, comecei analisando o código existente e relacionando seus conceitos àqueles que eu já conhecia de outras linguagens de programação. Quando encontrava trechos cuja finalidade não compreendia, utilizei ferramentas de inteligência artificial, especialmente o ChatGPT, para obter explicações sobre a sintaxe e o funcionamento dos recursos empregados. Esse processo contribuiu para que eu entendesse melhor a base do projeto e pudesse implementar as novas demandas.

Após adquirir uma compreensão inicial do código JavaScript, desenvolvi a funcionalidade de pastas. Ela permite criar uma pasta, associar notas a ela, abrir a pasta para visualizar seu conteúdo e retornar à página inicial. Essa foi a etapa em que encontrei menos dificuldades, pois pude reaproveitar parte significativa da estrutura já existente no projeto original.

Em seguida, implementei a lixeira, possibilitando que o usuário recupere notas e pastas excluídas ou as remova permanentemente. Mantive a função de exclusão definitiva que já existia e ampliei seu funcionamento para contemplar também as pastas. Para implementar a recuperação, compreendi como os dados eram armazenados na variável `notes` e desenvolvi uma interface que exibe os itens excluídos separadamente. A restauração consiste em transferir o conteúdo selecionado da lixeira de volta para a lista principal de notas.

As demandas de exportação e formatação de texto foram as etapas mais desafiadoras. Como eu ainda não havia desenvolvido funcionalidades semelhantes, precisei pesquisar e compreender os mecanismos envolvidos, contando também com o apoio da inteligência artificial para interpretar e estruturar parte do código. Inicialmente, optei por exportar as notas no formato `.txt`, por ser uma solução simples e não haver uma especificação de formato no enunciado. Posteriormente, percebi uma limitação dessa escolha: os recursos de negrito, itálico e listas são representados por marcações HTML, que acabam sendo exibidas como tags no arquivo de texto. Considero esse um ponto que pode ser aprimorado futuramente, por exemplo, com a adoção de um formato que preserve a formatação.

Para implementar negrito, itálico e listas, utilizei comandos de edição disponibilizados pelo próprio navegador. Embora inicialmente eu esperasse uma solução mais complexa, a implementação foi relativamente simples. A criação do sistema de tags também foi direta: armazenei as tags associadas a cada nota em um array, com apoio da inteligência artificial para organizar a implementação.

A funcionalidade de fixar notas e alterar sua posição na tela exigiu que eu pesquisasse como realizar a ordenação dos elementos. Apesar de o código final ser curto, essa etapa foi importante para compreender como controlar a posição dos componentes na interface.

Por fim, a implementação do suporte a Markdown foi a etapa que apresentou maior dificuldade. O principal desafio não estava apenas em interpretar a marcação, mas em fazê-la funcionar tanto no título quanto no conteúdo da nota e manter esse comportamento após o salvamento. Depois de testar diferentes abordagens sem obter o resultado esperado, optei por incluir um botão que habilita ou desabilita o modo Markdown, tornando seu funcionamento mais previsível para o usuário.

Em relação ao HTML, eu já possuía algum conhecimento, o que tornou a estruturação da interface mais simples. Nesse caso, utilizei a inteligência artificial principalmente para compreender como conectar os elementos da página ao código JavaScript. No CSS, como eu tinha pouca familiaridade, precisei de mais apoio para organizar o layout e melhorar a apresentação visual da aplicação.

Por fim, eu não imaginava que as demandas resultariam em tantas linhas de código. No entanto, quando percebi, o arquivo JavaScript já contava com 1.143 linhas, o que dificultava sua organização e tornava o código menos limpo. Para melhorar sua modularização, decidi utilizar a IA do VS Code como apoio. Fiquei surpresa com o resultado, pois a ferramenta criou os arquivos necessários, separou as funções em módulos, adicionou os imports e ainda realizou testes para verificar se a aplicação continuava funcionando sem erros. Considerei essa experiência muito interessante e útil, pois, além de auxiliar na conexão entre as funções, a modularização automatizada poupou bastante tempo durante o desenvolvimento.


### Trechos de código


## Trecho 1

```javascript
export function markdownToHTML(text) {
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^- (.+)$/gm, '• $1');

    return html.replace(/\n/g, '<br>');
}
```

Decidi colocar esse trecho como exemplo de algo que aprendi, mas ainda tenho dificuldade de compreensão. Eu nunca imaginaria essas linhas e não chegaria sozinha à escrita delas. Acho difícil identificar o que `(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')` está determinando.

## Trecho 2

```javascript
export function reorderNotes(folderIndex, fromIndex, toIndex) {
    const notes = getNotes();
    const folder = notes[folderIndex];
    const draggedNote = folder?.notes[fromIndex];
    const targetNote = folder?.notes[toIndex];

    if (!draggedNote || !targetNote || draggedNote.fixed !== targetNote.fixed) {
        return false;
    }

    const [removedNote] = folder.notes.splice(fromIndex, 1);
    const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    folder.notes.splice(adjustedIndex, 0, removedNote);
    saveNotes(notes);
    return true;
}
```

Escolhi esse segundo trecho por achar interessante a forma como o código funciona. Como mencionei na seção de desenvolvimento, eu não sabia como escrever esse código; apenas imaginava como ele deveria funcionar. Por isso, considerei essa uma funcionalidade interessante para apresentar.


## Tecnologias

### Linguagens e afins

- JavaScript ES Modules: divisão do código em arquivos com import e export.
- JavaScript
- HTML5
- CSS3
- DOM API: manipulação dos elementos HTML por meio de document, getElementById, innerHTML e eventos.
- Drag and Drop API: implementação do recurso de arrastar e reorganizar notas e pastas.
- ExecCommand API: aplicação de negrito, itálico e listas no editor de texto.
- RegEx (expressões regulares) interpretação de marcações Markdown, como **negrito** e *itálico*.
- Blob e URL API geração e download dos arquivos .txt exportados.

### Ambiente de desenvolvimento

- VScode com extensão de live preview para ver o aplicação enquanto desenvolvia. 

- GitHub Copilot, integrado no VScode.

## Referências e créditos


- ChatGPT gratuito na geração e explicação de códigos.

- Link disponibilizado em aula sobre HTML e CSS.

- Video no youtube sobre markdown.




---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2026b) em 2026b
