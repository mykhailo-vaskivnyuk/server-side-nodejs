const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {

    console.log("Request for %s by the method %s", req.url, req.method);

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end('Hello, World');

    if (req.method == "GET") {

        let fileURL;
        if (req.url == "/") fileURL = "/index.html";
        else fileURL = req.url;

        const filePath = path.resolve("./public" + fileURL);
        const fileExt = path.extname(filePath);

        if (fileExt == ".html") {

            fs.exists(filePath, (exists) => {

                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/html");
                    res.end("Error 404: file [" + fileURL + "] not found!");
                    return;
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                fs.createReadStream(filePath).pipe(res);
           
            });

        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html");
            res.end("Error 404: file [" + fileURL + "] not an HTML file!");
        }

    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end("Error 404: method [" + req.method + "] not supported!");
    }

});

server.listen(port, hostname, () => {
    console.log('Server is running at http://%s:%s', hostname, port);
});