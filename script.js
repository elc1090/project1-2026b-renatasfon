import { formatEditor, applyMarkdown } from './formatting.js';
import {
    deleteNote as removeNote,
    deleteFolder as removeFolder,
    deleteNoteFromFolder as removeNoteFromFolder,
    restoreItem as restoreTrashItem,
    deletePermanently as removeTrashItem,
    showTrash as renderTrash
} from './trash.js';
import {
    createNote,
    togglePin as toggleNotePin,
    reorderNotes,
    exportNote as exportMainNote,
    exportAll as exportAllMainNotes,
    showNotes as renderNotes
} from './notes.js';
import {
    createFolder,
    togglePin as toggleFolderPinInStore,
    toggleNotePin as toggleFolderNotePin,
    reorderNotes as reorderFolderNotes,
    exportNote as exportFolderNote,
    exportAllNotes as exportAllFolderNotes,
    showFolder as renderFolder
} from './folders.js';

const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');
const addTags = document.getElementById('addTags');
const addColor = document.getElementById('addColor');
const addNoteButton = document.getElementById('addNote');
const addFolderButton = document.getElementById('addFolder');
const notesDiv = document.getElementById('notes');
const inputBox = document.getElementById('input-box');
const trashButton = document.getElementById('trashButton');
const exportAllButton = document.getElementById('exportAll');
const view = { inputBox, trashButton, addFolderButton, exportAllButton, notesDiv };

let currentFolder = null;
let draggedIndex = null;
let activeEditor = null;

function showNotes() { renderNotes(view); }
function showFolder() { renderFolder({ ...view, folderIndex: currentFolder }); }
function showTrash() { renderTrash({ inputBox, trashButton, notesDiv }); }
function formatTitle(command) { formatEditor(command, addTitle); }
function formatText(command) { formatEditor(command, addText); }
function applyMarkdownToActive() { if (activeEditor) applyMarkdown(activeEditor); }
function dragStart(index) { draggedIndex = index; }
function allowDrop(event) { event.preventDefault(); }

function dropItem(index) {
    if (draggedIndex !== null) {
        reorderNotes(draggedIndex, index);
        draggedIndex = null;
        showNotes();
    }
}

function dropNoteFromFolder(index) {
    if (draggedIndex !== null) {
        reorderFolderNotes(currentFolder, draggedIndex, index);
        draggedIndex = null;
        showFolder();
    }
}

function addNotes() {
    if (addText.innerText.trim() === '') {
        alert('Add your note');
        return;
    }

    createNote({
        type: 'note',
        title: addTitle.innerHTML,
        text: addText.innerHTML,
        tags: addTags.value.split(',').map(tag => tag.trim()).filter(Boolean),
        color: addColor.value,
        fixed: false
    }, currentFolder);

    addTitle.innerHTML = '';
    addText.innerHTML = '';
    addTags.value = '';
    addColor.value = '#000000';
    currentFolder === null ? showNotes() : showFolder();
}

function addFolder() {
    const folderName = prompt('Digite o nome da pasta:');
    if (folderName !== null && createFolder(folderName)) showNotes();
}

function openFolder(index) { currentFolder = index; showFolder(); }
function backToNotes() { currentFolder = null; showNotes(); }
function togglePin(index) { toggleNotePin(index); showNotes(); }
function togglePinFromFolder(index) { toggleFolderNotePin(currentFolder, index); showFolder(); }
function toggleFolderPin(index) { toggleFolderPinInStore(index); showNotes(); }
function exportNote(index) { exportMainNote(index); }
function exportNoteFromFolder(index) { exportFolderNote(currentFolder, index); }
function exportAllNotesFromFolder() { exportAllFolderNotes(currentFolder); }

addTitle.addEventListener('focus', () => { activeEditor = addTitle; });
addText.addEventListener('focus', () => { activeEditor = addText; });
addNoteButton.addEventListener('click', addNotes);
addFolderButton.addEventListener('click', addFolder);
exportAllButton.addEventListener('click', exportAllMainNotes);
trashButton.addEventListener('click', showTrash);

Object.assign(window, {
    formatTitle, formatText, applyMarkdownToActive, dragStart, allowDrop,
    dropItem, dropNoteFromFolder, openFolder, backToNotes, togglePin,
    togglePinFromFolder, toggleFolderPin, exportNote, exportNoteFromFolder,
    exportAllNotesFromFolder,
    deleteNote: index => removeNote(index, showNotes),
    deleteFolder: index => removeFolder(index, showNotes),
    deleteNoteFromFolder: index => removeNoteFromFolder(index, currentFolder, showFolder),
    restoreItem: index => restoreTrashItem(index, showTrash),
    deletePermanently: index => removeTrashItem(index, showTrash)
});

showNotes();
