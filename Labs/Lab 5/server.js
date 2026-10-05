const http = require('http');
const url = require('url');
const DateUtils = require('./modules/utils');
const Messages = require('./lang/en/en');
const FileManager = require('./modules/fileManager');

/**
 * Server class that handles HTTP requests and provides responses based on API endpoints.
 */
class AppServer {
    /**
     * AppServer constructor
     */
    constructor() {
        this.port = process.env.PORT || 8000;
        this.dateUtils = new DateUtils();
        this.fileManager = new FileManager();
    }

    /**
     * Handles HTTP requests and sends appropriate responses based on the requested endpoint.
     * @param {*} req - request to be processed
     * @param {*} res - response based on the request
     */
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const query = parsedUrl.query;

        if (path.includes('/getDate/')) {
            this.processDateRequest(query, res);
        } 
        else if (path.includes('/writeFile/')) {
            this.processAppendRequest(query, res);
        } 
        else if (path.includes('/readFile/')) {
            this.processReadRequest(path, res);
        } 
        else {
            this.notFoundResponse(res);
        }
    }

    /**
     * Replaces and displays Messages.GREETING with name and current date and time.
     * @param {*} query - the query containing the name parameter
     * @param {*} res - response to send back to the client
     */
    processDateRequest(query, res) {
        const name = query.name || 'Guest';
        const currentTime = this.dateUtils.getDate();

        const responseText = Messages.GREETING
            .replace('%1', name)
            .replace('%2', currentTime);

        // Format response with styling
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue; 
                           font-weight: bold; 
                           font-family: Arial, sans-serif;">${responseText}</p>`);
    }

    /**
     * Processes a request to append text to a file.
     * @param {*} query - the query containing the text to append
     * @param {*} res - response to send back to the client
     */
    processAppendRequest(query, res) {
        const text = query.text || '';

        this.fileManager.append('file.txt', text, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(Messages.WRITE_FAILED);
            } 
            else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(Messages.WRITE_SUCCESS);
            }
        });
    }

    /**
     * Processes a request to read a file.
     * @param {*} pathname - the file to be read
     * @param {*} res - response to send back to the client
     */
    processReadRequest(pathname, res) {
        const filename = pathname.split('/').pop();

        this.fileManager.read(filename, (err, data) => {
            if (err) {
                const errorMessage = Messages.FILE_NOT_FOUND.replace('%1', filename);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(errorMessage);
            } 
            else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    }

    /**
     * Displays a 404 error if the endpoint cannot be found.
     * @param {*} res 
     */
    notFoundResponse(res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(Messages.ENDPOINT_NOT_FOUND);
    }

    /**
     * Starts the server and listens for incoming requests.
     */
    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        
        server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const myServer = new AppServer();
myServer.start();