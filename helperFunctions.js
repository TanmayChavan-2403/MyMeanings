const fs = require('fs');

module.exports.log = function logData(text){
    fs.appendFile('log.txt', text + '\n', (err) => {
        if (err){
            console.log(err);
        }
    })
}