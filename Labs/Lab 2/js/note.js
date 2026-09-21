/**
 * Represents a note with an ID and content
 */
class Note {
    /**
     * Note constructor
     * @param {*} id - ID of the note
     * @param {*} content - content of the note
     */
    constructor(id, content = "") {
        this.id = id;
        this.content = content;
    }

    /**
     * Creates the UI for the note and displays the note's content
     * @param {*} container - The container element to append the note UI to
     * @param {*} removeCallback - The callback function to handle note removal
     */
    createUI(container, removeCallback) {
        const wrapper = document.createElement("div");
        wrapper.className = "noteWrapper";

        const textArea = document.createElement("textarea");
        textArea.value = this.content;
        
        // Update the object's content when the user types
        textArea.addEventListener("input", (e) => {
            this.content = e.target.value;
        });

        const removeButton = document.createElement("button");
        removeButton.className = "removeButton";
        removeButton.textContent = strings.removeNote;
        
        // Callback to remove note from array, DOM, and localStorage
        removeButton.addEventListener("click", () => {
            removeCallback(this.id, wrapper);
        });

        wrapper.appendChild(textArea);
        wrapper.appendChild(removeButton);
        container.appendChild(wrapper);
    }
}