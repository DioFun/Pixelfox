const { readFileSync, writeFileSync } = require('graceful-fs');

exports.loadFile = function (file) {

    return JSON.parse(readFileSync("./settings/" + file));

};

exports.saveFile = function (file, content) {

    writeFileSync("./settings/" + file, JSON.stringify(content));

};