const fs = require('fs');
const errorFunction = require('./../utils/errorFunction');

const logger = (req, res, next) => {
    let logtext = `${req.method} recieved on ${req.url} at ${new Date()}`;

    let currentDate = new Date().toJSON().slice(0, 10);

    fs.appendFile(`./src/log/log-${currentDate}.txt`, logtext + "\r\n", function(err) {
        if(err) {
            return res.status(400).json(errorFunction(true, err.message));
        }
    });
    next();
}

module.exports = logger;