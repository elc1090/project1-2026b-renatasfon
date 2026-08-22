const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');
const addNoteButton = document.getElementById('addNote');
const addFolderButton = document.getElementById('addFolder');
const notesDiv = document.getElementById('notes');
const inputBox = document.getElementById('input-box');
const trashButton = document.getElementById('trashButton');

let currentFolder = null;

showNotes();

function addNotes(){
    let notes = localStorage.getItem('notes');
    if(notes === null){
        notes = [];
    }else{
        notes = JSON.parse(notes);
    }

    if(addText.value == ''){
        alert('Add your note');
        return;
    }
    
    const noteObj = {
        type: "note",
        title: addTitle.value,
        text: addText.value,
    }
    addTitle.value = '';
    addText.value = '';

    if(currentFolder === null){

        notes.push(noteObj);

    }else{

        notes[currentFolder].notes.push(noteObj);

    }

    localStorage.setItem('notes', JSON.stringify(notes));
    
     if(currentFolder === null){

        showNotes();

    }else{

        showFolder();

    }
}

function addFolder(){

    let notes = localStorage.getItem('notes');

    if(notes === null){
        notes = [];
    }else{
        notes = JSON.parse(notes);
    }

    const folderName = prompt("Digite o nome da pasta:");

    if(folderName === null || folderName.trim() === ''){
        return;
    }

    const folderObj = {
        type: "folder",
        id: Date.now(),
        title: folderName.trim(),
        notes: []
    }

    notes.push(folderObj);

    localStorage.setItem('notes', JSON.stringify(notes));

    showNotes();
}

function showNotes(){

    inputBox.style.display = 'block';
    trashButton.style.display = 'block';
    addFolderButton.style.display = 'inline-block';

    let notesHTML = '';

    let notes = localStorage.getItem('notes');

    if(notes === null){
        notes = [];
    }else{
        notes = JSON.parse(notes);
    }

    for(let i = 0; i < notes.length; i++){

        // ==========================
        // PASTA
        // ==========================

        if(notes[i].type === "folder"){

            notesHTML += `
                <div class="folder">

                    <div class="folder-content" onclick="openFolder(${i})">

                        <div class="folder-icon">
                            📁
                        </div>

                        <div class="folder-title">
                            ${notes[i].title}
                        </div>

                    </div>

                    <button
                        class="deleteFolder"
                        onclick="event.stopPropagation(); deleteFolder(${i})">
                        🗑️
                    </button>

                </div>
            `;

        }

        // ==========================
        // NOTA
        // ==========================

        else{

            notesHTML += `
                <div class="note">

                    <button
                        class="deleteNote"
                        onclick="deleteNote(${i})">
                        🗑️
                    </button>

                    <div class="note-icon">
                        📝
                    </div>

                    <span class="title">
                        <strong>
                            ${notes[i].title === "" ? 'Note' : notes[i].title}
                        </strong>
                    </span>

                    <div class="text">
                        ${notes[i].text}
                    </div>

                </div>
            `;
        }
    }

    notesDiv.innerHTML = notesHTML;
}

function openFolder(ind){

    currentFolder = ind;

    showFolder();
}

function showFolder(){
    inputBox.style.display = 'block';
    trashButton.style.display = 'none';
    addFolderButton.style.display = 'none';

    let notes = localStorage.getItem('notes');

    if(notes === null){
        return;
    }

    notes = JSON.parse(notes);

    const folder = notes[currentFolder];

    let folderHTML = `
        <div class="folder-navigation">
            <button id="backButton" onclick="backToNotes()">
                 ← Voltar
            </button>
        </div>
    `;

    let notesHTML = '';

    for(let i = 0; i < folder.notes.length; i++){

        notesHTML += `
            <div class="note">

                <button class="deleteNote" onclick="deleteNoteFromFolder(${i})">
                    🗑️
                </button>
                
                <span class="title">
                    <strong style="font-size: 20px;">
                        ${folder.notes[i].title === "" ? 'Note' : folder.notes[i].title}
                    </strong>
                </span>

                <div class="text">${folder.notes[i].text}</div>
            </div>
        `;
    }

    notesDiv.innerHTML = folderHTML + notesHTML;
}

function backToNotes(){

    currentFolder = null;

    inputBox.style.display = 'block';

    trashButton.style.display = 'block';

    showNotes();
}

function deleteNote(ind){

    let notes = localStorage.getItem('notes');

    if(notes === null){
        return;
    }

    notes = JSON.parse(notes);

    let trash = localStorage.getItem('trash');

    if(trash === null){
        trash = [];
    }else{
        trash = JSON.parse(trash);
    }

    const note = notes[ind];

    const trashItem = {
        type: "note",
        title: note.title,
        text: note.text,
        originalLocation: "main"
    };

    trash.push(trashItem);

    notes.splice(ind, 1);

    localStorage.setItem('notes', JSON.stringify(notes));

    localStorage.setItem('trash', JSON.stringify(trash));

    showNotes();
}

function deleteFolder(ind){

    let notes = localStorage.getItem('notes');

    if(notes === null){
        return;
    }

    notes = JSON.parse(notes);

    let trash = localStorage.getItem('trash');

    if(trash === null){
        trash = [];
    }else{
        trash = JSON.parse(trash);
    }

    const folder = notes[ind];

    trash.push(folder);

    notes.splice(ind, 1);

    localStorage.setItem('notes', JSON.stringify(notes));

    localStorage.setItem('trash', JSON.stringify(trash));

    showNotes();
}

function deleteNoteFromFolder(ind){

    let notes = localStorage.getItem('notes');

    if(notes === null){
        return;
    }

    notes = JSON.parse(notes);

    let trash = localStorage.getItem('trash');

    if(trash === null){
        trash = [];
    }else{
        trash = JSON.parse(trash);
    }

    const folder = notes[currentFolder];

    const note = folder.notes[ind];

    const trashItem = {
        type: "note",
        title: note.title,
        text: note.text,
        originalLocation: "folder",
        originalFolderId: folder.id
    };

    trash.push(trashItem);

    folder.notes.splice(ind, 1);

    localStorage.setItem('notes', JSON.stringify(notes));

    localStorage.setItem('trash', JSON.stringify(trash));

    showFolder();
}

function showTrash(){

    let trash = localStorage.getItem('trash');

    if(trash === null){
        trash = [];
    }else{
        trash = JSON.parse(trash);
    }

    // Esconde a área de criação de notas
    inputBox.style.display = 'none';

    // Esconde o botão da lixeira enquanto já estamos nela
    trashButton.style.display = 'none';

    let trashHTML = `
        <div class="trash-page">

            <div class="trash-header">

                <h2>🗑️ Lixeira</h2>

                <button class="trash-back" onclick="backToNotes()">
                    ← Voltar
                </button>

            </div>

            <div class="trash-content">
    `;


    if(trash.length === 0){

        trashHTML += `
            <p class="empty-trash">
                A lixeira está vazia.
            </p>
        `;

    }else{

        for(let i = 0; i < trash.length; i++){

            if(trash[i].type === "folder"){

                trashHTML += `
                    <div class="trash-item">

                        <div class="trash-info">

                            <strong>
                                📁 ${trash[i].title}
                            </strong>

                            <p>
                                Pasta
                            </p>

                        </div>

                        <div class="trash-actions">

                            <button onclick="restoreItem(${i})">
                                Recuperar
                            </button>

                            <button onclick="deletePermanently(${i})">
                                Excluir permanentemente
                            </button>

                        </div>

                    </div>
                `;

            }else{

                trashHTML += `
                    <div class="trash-item">

                        <div class="trash-info">

                            <strong>
                                📝 ${trash[i].title === "" ? 'Note' : trash[i].title}
                            </strong>

                            <p>
                                ${trash[i].text}
                            </p>

                        </div>

                        <div class="trash-actions">

                            <button onclick="restoreItem(${i})">
                                Recuperar
                            </button>

                            <button onclick="deletePermanently(${i})">
                                Excluir permanentemente
                            </button>

                        </div>

                    </div>
                `;
            }
        }
    }

    trashHTML += `
            </div>
        </div>
    `;

    notesDiv.innerHTML = trashHTML;
}

function restoreItem(ind){

    let notes = localStorage.getItem('notes');

    if(notes === null){
        notes = [];
    }else{
        notes = JSON.parse(notes);
    }

    let trash = localStorage.getItem('trash');

    if(trash === null){
        return;
    }

    trash = JSON.parse(trash);

    const item = trash[ind];

    if(item.type === "note" && item.originalLocation === "folder"){

        const folder = notes.find(function(note){
            return note.type === "folder" && note.id === item.originalFolderId;
        });

        if(folder !== undefined){

            const restoredNote = {
                type: "note",
                title: item.title,
                text: item.text
            };

            folder.notes.push(restoredNote);

        }else{

            const restoredNote = {
                type: "note",
                title: item.title,
                text: item.text
            };

            notes.push(restoredNote);
        }

    }else{

        const restoredItem = {
            ...item
        };

        delete restoredItem.originalLocation;
        delete restoredItem.originalFolderId;

        notes.push(restoredItem);
    }


    trash.splice(ind, 1);

    localStorage.setItem('notes', JSON.stringify(notes));

    localStorage.setItem('trash', JSON.stringify(trash));

    showTrash();
}

function deletePermanently(ind){

    let trash = localStorage.getItem('trash');

    if(trash === null){
        return;
    }

    trash = JSON.parse(trash);

    trash.splice(ind, 1);

    localStorage.setItem('trash', JSON.stringify(trash));

    showTrash();
}

addNoteButton.addEventListener('click', addNotes);
addFolderButton.addEventListener('click', addFolder);
trashButton.addEventListener('click', showTrash);