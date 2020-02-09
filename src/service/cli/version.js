'use strict';

const {CommandsNames} = require(`./constants.js`);
const packageJsonFile = require(`../../../package.json`);

const chalk = require(`chalk`);

module.exports = {
  name: CommandsNames.VERSION,
  run() {
    const version = packageJsonFile.version;
    console.info(chalk.blue(version));
  }
};
