document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("notesContainer");
    const timeDisplay = document.getElementById("timeDisplay");
    let lastRetrievedString = null;

    document.getElementById("pageTitle").textContent = strings.readerPageTitle;
    document.getElementById("backButton").textContent = strings.back;

    function retrieveNotes() {
        const storedNotes = localStorage.getItem("notes");
        
        // Rebuild DOM only if content changed to prevent cursor flashing/scrolling issues
        if (storedNotes !== lastRetrievedString) {
            container.innerHTML = ""; 
            
            if (storedNotes) {
                const parsedNotes = JSON.parse(storedNotes);
                parsedNotes.forEach(noteData => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "noteWrapper";
                    
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