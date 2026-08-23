import { getNotes, saveNotes } from './storage.js';
import { exportNote as downloadNote, exportNotes } from './exports.js';

export function createNote(note, folderIndex = null) {
    const notes = getNotes();

    if (folderIndex === null) {
        notes.push(note);
    } else if (notes[folderIndex]?.type === 'folder') {
        notes[folderIndex].notes.push(note);
    }

    saveNotes(notes);
}

export function togglePin(index) {
    const notes = getNotes();

    if (!notes[index]) {
        return;
    }

    notes[index].fixed = !notes[index].fixed;
    saveNotes(notes);
}

export function reorderNotes(fromIndex, toIndex) {
    const notes = getNotes();
    const draggedItem = notes[fromIndex];
    const targetItem = notes[toIndex];

    if (!draggedItem || !targetItem || draggedItem.fixed !== targetItem.fixed) {
        return false;
    }

    const [removedItem] = notes.splice(fromIndex, 1);
    const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    notes.splice(adjustedIndex, 0, removedItem);
    saveNotes(notes);
    return true;
}

export function exportNote(index) {
    const note = getNotes()[index];
    downloadNote(note);
}

export function exportAll() {
    exportNotes(getNotes());
}

export function showNotes({ inputBox, trashButton, addFolderButton, exportAllButton, notesDiv }) {
    inputBox.style.display = 'block';
    trashButton.style.display = 'block';
    addFolderButton.style.display = 'inline-block';
    exportAllButton.style.display = 'inline-block';

    const sortedNotes = getNotes()
        .map((item, index) => ({ item, originalIndex: index }))
        .sort((a, b) => (b.item.fixed === true) - (a.item.fixed === true));

    notesDiv.innerHTML = sortedNotes.map(({ item, originalIndex }) => {
        if (item.type === 'folder') {
            return `<div class="folder" draggable="true" ondragstart="dragStart(${originalIndex})" ondragover="allowDrop(event)" ondrop="dropItem(${originalIndex})">
                <div class="folder-content" onclick="openFolder(${originalIndex})">
                    <div class="folder-icon">📁</div><div class="folder-title">${item.title}</div>
                </div>
                <button class="pinFolder" onclick="event.stopPropagation(); toggleFolderPin(${originalIndex})">${item.fixed ? '📌' : '📍'}</button>
                <button class="deleteFolder" onclick="event.stopPropagation(); deleteFolder(${originalIndex})">🗑️</button>
            </div>`;
        }

        return `<div class="note" style="border-color: ${item.color || '#000000'}" draggable="true" ondragstart="dragStart(${originalIndex})" ondragover="allowDrop(event)" ondrop="dropItem(${originalIndex})">
            <button class="pinNote" onclick="togglePin(${originalIndex})">${item.fixed ? '📌' : '📍'}</button>
            <button class="deleteNote" onclick="deleteNote(${originalIndex})">🗑️</button>
            <div class="note-icon">📝</div>
            <span class="title"><strong>${item.title === '' ? 'Note' : item.title}</strong></span>
            <div class="text">${item.text}</div>
            <div class="note-tags">${(item.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
            <button class="exportNote" onclick="exportNote(${originalIndex})">Exportar</button>
        </div>`;
    }).join('');
}
