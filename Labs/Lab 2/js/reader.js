document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("notesContainer");
    const timeDisplay = document.getElementById("timeDisplay");
    let lastRetrievedString = null;

    document.getElementById("pageTitle").textContent = strings.readerPageTitle;
    document.getElementById("backButton").textContent = strings.back;

    /**
     * Retrieves notes from the localStorage and DOM if there are changes
     */
    function retrieveNotes() {
        const storedNotes = localStorage.getItem("notes");
        
        // Rebuild the DOM if the content has changed
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