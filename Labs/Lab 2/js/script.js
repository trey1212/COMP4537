import { STRINGS } from "../lang/messages/en/user.js";

/*
 * Author: Romeo Jose Tarrayo (Trey) - A01455838
 */

class UserInterface {
    constructor() {
        this.labTitle = document.getElementById("labTitle");
        this.writerTitle = document.getElementById("writerTitle");
        this.readerTitle = document.getElementById("readerTitle");

        this.initializeTitles();
    }

    initializeTitles() {
        this.labTitle.textContent = STRINGS.LAB_TITLE;
        this.writerTitle.textContent = STRINGS.WRITER_TITLE;
        this.readerTitle.textContent = STRINGS.READER_TITLE;
    }
}