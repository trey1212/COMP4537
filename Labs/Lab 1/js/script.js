import { STRINGS } from "../lang/messages/en/user.js";

/**
 * Memory button and game logic script
 * 
 * @author Trey Tarrayo
 * @version 1.0
 */

/**
 * Represents a number button in the game
 * 
 * @param {number} orderNumber - The order number of the button
 * @param {function} onClick - Action when button is clicked
 */
class NumberButton {
    /**
     * NumberButton constructor
     * @param {number} orderNumber 
     * @param {function} onClick 
     */
    constructor(orderNumber, onClick) {
        this.orderNumber = orderNumber;
        this.element = document.createElement("div");
        this.element.className = "numberButton";
        this.element.textContent = this.orderNumber;
        this.element.style.backgroundColor = this.generateRandomColor();
        this.isClickable = false;

        this.element.addEventListener("click", () => {
            if (this.isClickable) {
                onClick(this);
            }
        });
    }

    /**
     * Generates a random RGB color string for the blocks
     * @returns random rgb string for blocks
     */
    generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Sets the position of the button
     * @param {number} x - The x-coordinate
     * @param {number} y - The y-coordinate
     */
    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }


    /**
     * Hides the number on the button
     */
    hideNumber() {
        this.element.textContent = "";
    }

    /**
     * Reveals the number on the button
     */
    revealNumber() {
        this.element.textContent = this.orderNumber;
    }

    /**
     * Makes the button clickable or not
     * @param {boolean} state - The clickable state
     */
    setClickable(state) {
        this.isClickable = state;
        this.element.style.cursor = state ? "pointer" : "default";
    }

    /**
     * Gets the boundary of the button
     * @returns the bounding rectangle of the button
     */
    getDimensions() {
        return this.element.getBoundingClientRect();
    }
}

/**
 * Represents the user interface for the game
 */
class UserInterface {
    /**
     * UserInterface constructor
     */
    constructor() {
        this.promptLabel = document.getElementById("prompt");
        this.inputField = document.getElementById("numButtons");
        this.goButton = document.getElementById("goButton");
        this.messageArea = document.getElementById("messageContainer");
        this.boundary = document.getElementById("gameContainer");

        this.initializeText();
    }

    /**
     * Initializes the text for the user interface
     */
    initializeText() {
        this.promptLabel.textContent = STRINGS.PROMPT_LABEL;
        this.goButton.textContent = STRINGS.GO_BUTTON_LABEL;
    }

    /**
     * Gets the number of buttons to create
     * @returns button number
     */
    getButtonNumber() {
        return parseInt(this.inputField.value, 10);
    }

    /**
     * Displays the win or lose message when game ends
     * @param {string} msg - The message to display
     */
    displayResultMessage(msg) {
        this.messageArea.textContent = msg;
    }

    /**
     * Resets the game by clearing all the buttons
     */
    resetGame() {
        this.boundary.innerHTML = "";
    }

    /**
     * Adds a button equal to the amount set by the user
     * @param {HTMLElement} buttonElement 
     */
    addButton(buttonElement) {
        this.boundary.appendChild(buttonElement);
    }

    /**
     * Gets the window size so the buttons don't generate outside the window
     * @returns window size
     */
    getBoundary() {
        return {
            width: this.boundary.clientWidth,
            height: this.boundary.clientHeight
        };
    }
}

/**
 * Represents the game engine that controls the game logic
 */
class GameEngine {
    /**
     * GameEngine constructor
     * @param {UserInterface} uiManager 
     */
    constructor(uiManager) {
        this.ui = uiManager;
        this.buttons = [];
        this.expectedOrderIndex = 1;
        this.totalButtons = 0;

        this.ui.goButton.addEventListener("click", () => this.initializeGame());
    }

    /**
     * Initializes the game and checks if user input is valid.
     * If not valid, ask user to enter a valid number
     * @returns {boolean} - True if the game is initialized
     */
    initializeGame() {
        const num = this.ui.getButtonNumber();
        
        // If the user input is invalid, display error message
        if (isNaN(num) || num < 3 || num > 7) {
            this.ui.displayResultMessage(STRINGS.INVALID_INPUT);
            return;
        }

        this.totalButtons = num;
        this.expectedOrderIndex = 1;
        this.buttons = [];
        
        this.ui.resetGame();
        this.ui.displayResultMessage("");

        this.createInitialButtons();
        this.scrambleButtons();
    }

    /**
     * Creates the buttons before they are scrambled
     */
    createInitialButtons() {
        let currentX = 0;
        let currentY = 0;
        const margin = 10;

        for (let i = 1; i <= this.totalButtons; i++) {
            const btn = new NumberButton(i, (clickedBtn) => this.processClick(clickedBtn));
            this.buttons.push(btn);
            this.ui.addButton(btn.element);

            // Calculate dimensions to so buttons don't generate outside the window
            const dimensions = btn.getDimensions();
            const buttonWidth = dimensions.width;
            const buttonHeight = dimensions.height;
            const bounds = this.ui.getBoundary();

            if (currentX + buttonWidth > bounds.width) {
                // Drop to next row if window width doesn't allow inline placement
                currentX = 0;
                currentY += buttonHeight + margin;
            }

            btn.setPosition(currentX, currentY);
            currentX += buttonWidth + margin;
        }
    }

    /**
     * Scrambles the buttons positions and starts the game
     */
    async scrambleButtons() {
        // Wait for n seconds based on total buttons
        await this.delay(this.totalButtons * 1000);

        // Randmize positions of the buttons
        for (let i = 0; i < this.totalButtons; i++) {
            this.scramblePositions();
            await this.delay(2000);
        }

        // Start the game
        this.buttons.forEach(btn => {
            btn.hideNumber();
            btn.setClickable(true);
        });
    }

    /**
     * Randomizes the location of the buttons within the game boundary
     * @returns 
     */
    scramblePositions() {
        if (this.buttons.length === 0) return;

        // Keep checking the dimensions of the window size so the buttons don't generate outside the window
        const bounds = this.ui.getBoundary();
        const buttonDimensions = this.buttons[0].getDimensions();

        const maxLeft = bounds.width - buttonDimensions.width;
        const maxTop = bounds.height - buttonDimensions.height;

        this.buttons.forEach(btn => {
            const randomX = Math.max(0, Math.floor(Math.random() * maxLeft));
            const randomY = Math.max(0, Math.floor(Math.random() * maxTop));
            btn.setPosition(randomX, randomY);
        });
    }

    /**
     * Processes the click event for a button
     * @param {*} clickedBtn 
     */
    processClick(clickedBtn) {
        if (clickedBtn.orderNumber === this.expectedOrderIndex) {
            clickedBtn.revealNumber();
            clickedBtn.setClickable(false);
            this.expectedOrderIndex++;

            if (this.expectedOrderIndex > this.totalButtons) {
                this.ui.displayResultMessage(STRINGS.WIN_MESSAGE);
                this.disableAllButtons();
            }
        } else {
            this.ui.displayResultMessage(STRINGS.LOSE_MESSAGE);
            this.revealAllNumbers();
            this.disableAllButtons();
        }
    }

    /**
     * Reveals all the numbers when the user loses
     */
    revealAllNumbers() {
        this.buttons.forEach(btn => btn.revealNumber());
    }

    /**
     * Disables all buttons
     */
    disableAllButtons() {
        this.buttons.forEach(btn => btn.setClickable(false));
    }

    /**
     * Delays execution for a specified number of milliseconds
     * @param {*} ms 
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const userInterface = new UserInterface();
    new GameEngine(userInterface);
});