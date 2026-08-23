import { getNotes, saveNotes } from './storage.js';
import { exportNote as downloadNote, exportFolderNotes } from './exports.js';

export function createFolder(name) {
    const notes = getNotes();
    const folderName = name?.trim();

    if (!folderName) {
        return false;
    }

    notes.push({
        type: 'folder',
        id: Date.now(),
        title: folderName,
        notes: [],
        fixed: false
    });

    saveNotes(notes);
    return true;
}

export function togglePin(index) {
    const notes = getNotes();
    const folder = notes[index];

    if (!folder || folder.type !== 'folder') {
        return;
    }

    folder.fixed = !folder.fixed;
    saveNotes(notes);
}

export function toggleNotePin(folderIndex, noteIndex) {
    const notes = getNotes();
    const note = notes[folderIndex]?.notes[noteIndex];

    if (!note) {
        return;
    }

    note.fixed = !note.fixed;
    saveNotes(notes);
}

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

export function exportNote(folderIndex, noteIndex) {
    const note = getNotes()[folderIndex]?.notes[noteIndex];
    downloadNote(note);
}

export function exportAllNotes(folderIndex) {
    const folder = getNotes()[folderIndex];
    exportFolderNotes(folder);
}

export function showFolder({ folderIndex, inputBox, trashButton, addFolderButton, exportAllButton, notesDiv }) {
    inputBox.style.display = 'block';
    trashButton.style.display = 'none';
    addFolderButton.style.display = 'none';
    exportAllButton.style.display = 'none';

    const folder = getNotes()[folderIndex];
    if (!folder) {
        return;
    }

    const sortedNotes = folder.notes
        .map((item, index) => ({ item, originalIndex: index }))
        .sort((a, b) => (b.item.fixed === true) - (a.item.fixed === true));

    const navigation = `<div class="folder-navigation"><button id="backButton" onclick="backToNotes()">← Voltar</button><button onclick="exportAllNotesFromFolder()">Exportar todas</button></div>`;
    const content = sortedNotes.map(({ item, originalIndex }) => `<div class="note" style="border-color: ${item.color || '#000000'}" draggable="true" ondragstart="dragStart(${originalIndex}, true)" ondragover="allowDrop(event)" ondrop="dropNoteFromFolder(${originalIndex})">
        <button class="pinNote" onclick="togglePinFromFolder(${originalIndex})">${item.fixed ? '📌' : '📍'}</button>
        <button class="deleteNote" onclick="deleteNoteFromFolder(${originalIndex})">🗑️</button>
        <span class="title"><strong style="font-size: 20px;">${item.title === '' ? 'Note' : item.title}</strong></span>
        <div class="text">${item.text}</div>
        <div class="note-tags">${(item.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
        <button class="exportNote" onclick="exportNoteFromFolder(${originalIndex})">Exportar</button>
    </div>`).join('');

    notesDiv.innerHTML = navigation + content;
}
