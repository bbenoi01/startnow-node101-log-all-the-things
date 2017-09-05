const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
const header = req.headers['user-agent'].replace(",", "") + ",";
const date = new Date().toISOString() + ",";
const method = req.method + ",";
const url = req.path + ",";
const version = "HTTP/" + req.httpVersion + ",";
const status = res.statusCode + "\n";
const logger = header + date + method + url + version + status;

    fs.appendFile('server/logs.csv', logger, (err) => {
        if (err) throw err;
        console.log(logger);
        next();
    });
    
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

    fs.readFile('server/logs.csv', "utf-8", function(err, data) {

        function csvJSON(csv) {
            let lines = csv.split("\n");
            let result = [];
            let headers = lines[0].split(",");

            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let currentLine = lines[i].split(",");

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
                result.push(obj);
            }
            return result;
        }
        res.json(csvJSON(data));
        res.end();
    });
    
});
module.exports = app;