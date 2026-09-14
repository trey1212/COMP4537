import { STRINGS } from "../lang/messages/en/user.js";

/*
 * Author: Romeo Jose Tarrayo (Trey) - A01455838
 */

class MemoryButton {
    constructor(orderNumber, onClickCallback) {
        this.orderNumber = orderNumber;
        this.element = document.createElement("div");
        this.element.className = "memory-button";
        this.element.textContent = this.orderNumber;
        this.element.style.backgroundColor = this.generateRandomColor();
        this.isClickable = false;

        this.element.addEventListener("click", () => {
            if (this.isClickable) {
                onClickCallback(this);
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

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    hideNumber() {
        this.element.textContent = "";
    }

    revealNumber() {
        this.element.textContent = this.orderNumber;
    }

    setClickable(state) {
        this.isClickable = state;
        this.element.style.cursor = state ? "pointer" : "default";
    }

    getDimensions() {
        return this.element.getBoundingClientRect();
    }
}

class UserInterface {
    constructor() {
        this.promptLabel = document.getElementById("prompt");
        this.inputField = document.getElementById("numButtons");
        this.goButton = document.getElementById("goButton");
        this.messageArea = document.getElementById("messageContainer");
        this.gameArea = document.getElementById("gameContainer");

        this.initializeText();
    }

    initializeText() {
        this.promptLabel.textContent = STRINGS.PROMPT_LABEL;
        this.goButton.textContent = STRINGS.GO_BUTTON_LABEL;
    }

    getInputValue() {
        return parseInt(this.inputField.value, 10);
    }

    displayMessage(msg) {
        this.messageArea.textContent = msg;
    }

    clearGameArea() {
        this.gameArea.innerHTML = "";
    }

    addButton(buttonElement) {
        this.gameArea.appendChild(buttonElement);
    }

    getGameAreaBounds() {
        return {
            width: this.gameArea.clientWidth,
            height: this.gameArea.clientHeight
        };
    }
}

class GameEngine {
    constructor(uiManager) {
        this.ui = uiManager;
        this.buttons = [];
        this.expectedOrderIndex = 1;
        this.totalButtons = 0;

        this.ui.goButton.addEventListener("click", () => this.initializeGame());
    }

    initializeGame() {
        const num = this.ui.getInputValue();
        
        if (isNaN(num) || num < 3 || num > 7) {
            this.ui.displayMessage(STRINGS.INVALID_INPUT);
            return;
        }

        this.totalButtons = num;
        this.expectedOrderIndex = 1;
        this.buttons = [];
        
        this.ui.clearGameArea();
        this.ui.displayMessage("");

        this.renderInitialButtons();
        this.runScramblePhase();
    }

    renderInitialButtons() {
        let currentX = 0;
        let currentY = 0;
        const margin = 10;

        for (let i = 1; i <= this.totalButtons; i++) {
            const btn = new MemoryButton(i, (clickedBtn) => this.processClick(clickedBtn));
            this.buttons.push(btn);
            this.ui.addButton(btn.element);

            // Calculate dimensions to respect window width on initial layout
            const dimensions = btn.getDimensions();
            const btnWidth = dimensions.width;
            const btnHeight = dimensions.height;
            const bounds = this.ui.getGameAreaBounds();

            if (currentX + btnWidth > bounds.width) {
                // Drop to next row if window width doesn't allow inline placement
                currentX = 0;
                currentY += btnHeight + margin;
            }

            btn.setPosition(currentX, currentY);
            currentX += btnWidth + margin;
        }
    }

    async runScramblePhase() {
        // Pause for n seconds based on total buttons
        await this.delay(this.totalButtons * 1000);

        // Scramble n times with a 2-second interval
        for (let i = 0; i < this.totalButtons; i++) {
            this.scramblePositions();
            await this.delay(2000);
        }

        // Gameplay begins
        this.buttons.forEach(btn => {
            btn.hideNumber();
            btn.setClickable(true);
        });
    }

    scramblePositions() {
        if (this.buttons.length === 0) return;

        // Obtain dimensions each iteration to ensure window resizes between intervals are captured
        const bounds = this.ui.getGameAreaBounds();
        const btnDimensions = this.buttons[0].getDimensions();

        const maxLeft = bounds.width - btnDimensions.width;
        const maxTop = bounds.height - btnDimensions.height;

        this.buttons.forEach(btn => {
            const randomX = Math.max(0, Math.floor(Math.random() * maxLeft));
            const randomY = Math.max(0, Math.floor(Math.random() * maxTop));
            btn.setPosition(randomX, randomY);
        });
    }

    processClick(clickedBtn) {
        if (clickedBtn.orderNumber === this.expectedOrderIndex) {
            clickedBtn.revealNumber();
            clickedBtn.setClickable(false);
            this.expectedOrderIndex++;

            if (this.expectedOrderIndex > this.totalButtons) {
                this.ui.displayMessage(STRINGS.MSG_WIN);
                this.disableAllButtons();
            }
        } else {
            this.ui.displayMessage(STRINGS.MSG_LOSE);
            this.revealAllNumbers();
            this.disableAllButtons();
        }
    }

    revealAllNumbers() {
        this.buttons.forEach(btn => btn.revealNumber());
    }

    disableAllButtons() {
        this.buttons.forEach(btn => btn.setClickable(false));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Bootstrap application once DOM is entirely loaded
document.addEventListener("DOMContentLoaded", () => {
    const userInterface = new UserInterface();
    new GameEngine(userInterface);
});