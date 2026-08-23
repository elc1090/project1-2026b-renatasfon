export function formatEditor(command, editor) {
    document.execCommand(command, false, null);
    editor.focus();
}

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

export function applyMarkdown(editor) {
    const text = editor.innerText;

    if (text.trim() === '') {
        return;
    }

    editor.innerHTML = markdownToHTML(text);
    editor.focus();

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
