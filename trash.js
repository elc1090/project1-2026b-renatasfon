import { getNotes, saveNotes, getTrash, saveTrash } from './storage.js';

export function moveToTrash(notes, trash, item, location, folderId) {
    const trashItem = {
        type: item.type,
        title: item.title,
        text: item.text,
        tags: item.tags || [],
        color: item.color || '#000000',
        fixed: item.fixed || false,
        originalLocation: location
    };

    if (item.type === 'folder') {
        Object.assign(trashItem, item);
    }

    if (folderId !== undefined) {
        trashItem.originalFolderId = folderId;
    }

    trash.push(trashItem);
}

export function restoreFromTrash(notes, trash, index) {
    const item = trash[index];

    if (!item) {
        return;
    }

    if (item.type === 'note' && item.originalLocation === 'folder') {
        const folder = notes.find(note => note.type === 'folder' && note.id === item.originalFolderId);
        const restoredNote = {
            type: 'note',
            title: item.title,
            text: item.text,
            tags: item.tags || [],
            color: item.color || '#000000',
            fixed: item.fixed || false
        };

        if (folder) {
            folder.notes.push(restoredNote);
        } else {
            notes.push(restoredNote);
        }
    } else {
        const restoredItem = { ...item };
        delete restoredItem.originalLocation;
        delete restoredItem.originalFolderId;
        notes.push(restoredItem);
    }

    trash.splice(index, 1);
}

export function deleteFromTrash(trash, index) {
    trash.splice(index, 1);
}

export function deleteNote(index, render) {
    const notes = getNotes();
    const trash = getTrash();
    const note = notes[index];

    if (!note) {
        return;
    }

    moveToTrash(notes, trash, note, 'main');
    notes.splice(index, 1);
    saveNotes(notes);
    saveTrash(trash);
    render();
}

export function deleteFolder(index, render) {
    const notes = getNotes();
    const trash = getTrash();
    const folder = notes[index];

    if (!folder) {
        return;
    }

    moveToTrash(notes, trash, folder, 'main');
    notes.splice(index, 1);
    saveNotes(notes);
    saveTrash(trash);
    render();
}

export function deleteNoteFromFolder(index, folderIndex, render) {
    const notes = getNotes();
    const trash = getTrash();
    const folder = notes[folderIndex];
    const note = folder?.notes[index];

    if (!note) {
        return;
    }

    moveToTrash(notes, trash, note, 'folder', folder.id);
    folder.notes.splice(index, 1);
    saveNotes(notes);
    saveTrash(trash);
    render();
}

export function restoreItem(index, render) {
    const notes = getNotes();
    const trash = getTrash();

    restoreFromTrash(notes, trash, index);
    saveNotes(notes);
    saveTrash(trash);
    render();
}

export function deletePermanently(index, render) {
    const trash = getTrash();

    deleteFromTrash(trash, index);
    saveTrash(trash);
    render();
}

export function showTrash({ inputBox, trashButton, notesDiv }) {
    inputBox.style.display = 'none';
    trashButton.style.display = 'none';
    const trash = getTrash();
    const content = trash.length === 0
        ? '<p class="empty-trash">A lixeira está vazia.</p>'
        : trash.map((item, index) => `<div class="trash-item"><div class="trash-info"><strong>${item.type === 'folder' ? '📁' : '📝'} ${item.title === '' ? 'Note' : item.title}</strong><p>${item.type === 'folder' ? 'Pasta' : item.text}</p></div><div class="trash-actions"><button onclick="restoreItem(${index})">Recuperar</button><button onclick="deletePermanently(${index})">Excluir permanentemente</button></div></div>`).join('');

    notesDiv.innerHTML = `<div class="trash-page"><div class="trash-header"><h2>🗑️ Lixeira</h2><button class="trash-back" onclick="backToNotes()">← Voltar</button></div><div class="trash-content">${content}</div></div>`;
}
