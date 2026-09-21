import { STRINGS } from "../lang/messages/en/user.js";

/*
 * Author: Romeo Jose Tarrayo (Trey) - A01455838
 */

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("main-title").textContent = strings.title;
    document.getElementById("student-name").textContent = strings.studentName;
    document.getElementById("writer-link").textContent = strings.writerLink;
    document.getElementById("reader-link").textContent = strings.readerLink;
});