const fs = require('fs');

class FileManager {
    /**
     * Creates a new file if it doesn't exist, or adds text bottom of existing file.
     * @param {*} filepath - path of the file
     * @param {*} content - what will be written to the file
     * @param {*} callback - callback to handle errors
     */
    append(filepath, content, callback) {
        fs.appendFile(filepath, content + '\n', 'utf8', callback);
    }

    /**
     * Reads the contents of a file.
     * @param {*} filepath - path of the file
     * @param {*} callback - callback to handle errors
     * @returns file contents
     */
    read(filepath, callback) {
        return fs.readFile(filepath, 'utf8', callback);
    }
}

module.exports = FileManager;