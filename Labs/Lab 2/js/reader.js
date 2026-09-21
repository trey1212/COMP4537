document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("notes-container");
    const timeDisplay = document.getElementById("time-display");
    let lastRetrievedString = null;

    document.getElementById("page-title").textContent = strings.readerPageTitle;
    document.getElementById("back-btn").textContent = strings.back;

    function retrieveNotes() {
        const storedNotes = localStorage.getItem("notes");
        
        // Rebuild DOM only if content changed to prevent cursor flashing/scrolling issues
        if (storedNotes !== lastRetrievedString) {
            container.innerHTML = ""; 
            
            if (storedNotes) {
                const parsedNotes = JSON.parse(storedNotes);
                parsedNotes.forEach(noteData => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "note-wrapper";
                    
                    const textArea = document.createElement("textarea");
                    textArea.value = noteData.content;
                    textArea.readOnly = true; 
                    
                    wrapper.appendChild(textArea);
                    container.appendChild(wrapper);
                });
            }
            lastRetrievedString = storedNotes;
        }
        
        const now = new Date();
        timeDisplay.textContent = strings.lastRetrieved + now.toLocaleTimeString();
    }

    setInterval(retrieveNotes, 2000);
    retrieveNotes(); // Initial retrieve
});