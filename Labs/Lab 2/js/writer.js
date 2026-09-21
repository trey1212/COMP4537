document.addEventListener("DOMContentLoaded", () => {
    let notesArray = [];
    let noteCounter = 0;
    
    // Updated to match the new camelCase IDs in writer.html
    const container = document.getElementById("notesContainer");
    const timeDisplay = document.getElementById("timeDisplay");

    // Initialize string resources from user.js
    document.getElementById("pageTitle").textContent = strings.writerPageTitle;
    document.getElementById("addButton").textContent = strings.addNote;
    document.getElementById("backButton").textContent = strings.back;

    // Retrieve existing notes on load
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        parsedNotes.forEach(noteData => {
            const note = new Note(noteCounter++, noteData.content);
            notesArray.push(note);
            note.createUI(container, removeNote);
        });
    }

    // Add new note functionality
    document.getElementById("addButton").addEventListener("click", () => {
        const note = new Note(noteCounter++, "");
        notesArray.push(note);
        note.createUI(container, removeNote);
    });

    // Method passed to Note instances to handle self-deletion
    function removeNote(id, wrapperDOM) {
        notesArray = notesArray.filter(n => n.id !== id);
        wrapperDOM.remove();
        saveNotes(); // Saves to local storage instantly upon removal
    }

    // Serialize and save to LocalStorage
    function saveNotes() {
        // Map the array of Note objects to just their content for JSON storage
        const dataToSave = notesArray.map(n => ({ content: n.content }));
        localStorage.setItem("notes", JSON.stringify(dataToSave));
        
        const now = new Date();
        timeDisplay.textContent = strings.lastSaved + now.toLocaleTimeString();
    }

    // Fulfill 2-second interval requirement
    setInterval(saveNotes, 2000);
    saveNotes(); // Initial save to display the starting timestamp
});