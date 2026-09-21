class Note {
    constructor(id, content = "") {
        this.id = id;
        this.content = content;
    }

    // Encapsulate the creation of the UI within the object itself
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
        removeButton.textContent = strings.removeNote; // Sourced from user.js
        
        // Trigger the callback to remove from array, DOM, and LocalStorage
        removeButton.addEventListener("click", () => {
            removeCallback(this.id, wrapper);
        });

        wrapper.appendChild(textArea);
        wrapper.appendChild(removeButton);
        container.appendChild(wrapper);
    }
}