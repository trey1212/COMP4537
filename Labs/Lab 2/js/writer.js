document.addEventListener("DOMContentLoaded", () => {
    let notesArray = [];
    let noteCounter = 0;
    
    const container = document.getElementById("notesContainer");
    const timeDisplay = document.getElementById("timeDisplay");

    // Initialize the page with strings form user.js
    document.getElementById("pageTitle").textContent = strings.writerPageTitle;
    document.getElementById("addButton").textContent = strings.addNote;
    document.getElementById("backButton").textContent = strings.back;

    // Retrieve existing notes on load from localStorage
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        parsedNotes.forEach(noteData => {
            const note = new Note(noteCounter++, noteData.content);
            notesArray.push(note);
            note.createUI(container, removeNote);
        });
    }

    // Create a new note and add it to the DOM and array
    document.getElementById("addButton").addEventListener("click", () => {
        const note = new Note(noteCounter++, "");
        notesArray.push(note);
        note.createUI(container, removeNote);
    });

    // Delete a note from the array, DOM, and localStorage
    function removeNote(id, wrapperDOM) {
        notesArray = notesArray.filter(n => n.id !== id);
        wrapperDOM.remove();
        saveNotes();
    }

    // Serialize and save to LocalStorage
    function saveNotes() {
        // Map the array of Note objects to just their content for JSON storage
        const dataToSave = notesArray.map(n => ({ content: n.content }));
        localStorage.setItem("notes", JSON.stringify(dataToSave));
        
        const now = new Date();
        timeDisplay.textContent = strings.lastSaved + now.toLocaleTimeString();
    }

    setInterval(saveNotes, 2000);
    saveNotes(); // Initial save to display the starting timestamp
});