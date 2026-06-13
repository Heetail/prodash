// Notes Module
const NotesApp = (() => {
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const notesList = document.getElementById('notesList');

    let notes = DB.get('notes', []);
    let currentNoteId = null;

    const saveNotes = () => {
        DB.set('notes', notes);
    };

    const createNote = (title = 'Untitled') => {
        const note = {
            id: Date.now(),
            title: title || 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.unshift(note);
        saveNotes();
        selectNote(note.id);
        render();
    };

    const selectNote = (id) => {
        currentNoteId = id;
        const note = notes.find(n => n.id === id);
        if (note) {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            document.querySelectorAll('.note-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-id="${id}"]`).classList.add('active');
        }
    };

    const saveCurrentNote = () => {
        if (currentNoteId === null) return;
        const note = notes.find(n => n.id === currentNoteId);
        if (note) {
            note.title = noteTitle.value || 'Untitled Note';
            note.content = noteContent.value;
            note.updatedAt = new Date().toISOString();
            saveNotes();
            render();
        }
    };

    const deleteNote = (id) => {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        if (currentNoteId === id) {
            currentNoteId = null;
            noteTitle.value = '';
            noteContent.value = '';
        }
        render();
    };

    const render = () => {
        notesList.innerHTML = notes.map(note => `
            <li class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                <strong>${note.title}</strong>
                <small>${new Date(note.updatedAt).toLocaleDateString()}</small>
            </li>
        `).join('');

        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => selectNote(parseInt(item.dataset.id)));
            
            // Delete on right click
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (confirm('Delete this note?')) {
                    deleteNote(parseInt(item.dataset.id));
                }
            });
        });
    };

    const setupEventListeners = () => {
        addNoteBtn.addEventListener('click', () => {
            createNote(noteTitle.value);
        });

        saveNoteBtn.addEventListener('click', () => {
            saveCurrentNote();
            alert('Note saved!');
        });

        noteTitle.addEventListener('change', saveCurrentNote);
        noteContent.addEventListener('change', saveCurrentNote);
    };

    return {
        init: () => {
            setupEventListeners();
            render();
            if (notes.length > 0) {
                selectNote(notes[0].id);
            }
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    NotesApp.init();
});
