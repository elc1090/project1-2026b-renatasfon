function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function noteContent(title, text) {
    return `Título: ${title}\n\nTexto:\n${text}`;
}

export function exportNote(note) {
    if (!note || note.type === 'folder') {
        return;
    }

    downloadText(`${note.title}.txt`, noteContent(note.title, note.text));
}

export function exportNotes(notes, filename = 'todas-as-notas.txt') {
    const noteItems = notes.filter(item => item.type !== 'folder');

    if (noteItems.length === 0) {
        alert('Não há notas para exportar.');
        return;
    }

    const content = noteItems.map((note, index) => `===== NOTA ${index + 1} =====\n\n${noteContent(note.title, note.text)}\n\n`).join('');
    downloadText(filename, content);
}

export function exportFolderNotes(folder) {
    if (!folder || folder.notes.length === 0) {
        alert('Não há notas nesta pasta para exportar.');
        return;
    }

    const content = folder.notes
        .map((note, index) => `===== NOTA ${index + 1} =====\n\n${noteContent(note.title, note.text)}\n\n`)
        .join('');

    downloadText(`${folder.title}-notas.txt`, content);
}
