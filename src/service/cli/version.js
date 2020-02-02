'use strict';

const {CommandsNames} = require(`./constants.js`);
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: CommandsNames.VERSION,
  run() {
    const version = packageJsonFile.version;
    console.info(version);
  }
};
