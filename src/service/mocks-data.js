'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);

const {FILE_NAME} = require(`./cli/constants.js`);

const readFile = promisify(fs.readFile);

let data = ``;

const getMock = async () => {
  if (data === ``) {
    const fileContent = await readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  }
  return data;
};

module.exports = getMock;
