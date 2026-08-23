const NOTES_KEY = 'notes';
const TRASH_KEY = 'trash';

function readList(key) {
    const value = localStorage.getItem(key);
    return value === null ? [] : JSON.parse(value);
}

export function getNotes() {
    return readList(NOTES_KEY);
}

export function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getTrash() {
    return readList(TRASH_KEY);
}

export function saveTrash(trash) {
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
}
