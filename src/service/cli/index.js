'use strict';

const version = require(`./../cli/version.js`);
const generate = require(`./../cli/generate.js`);
const help = require(`./../cli/help.js`);

const Cli = {
  [version.name]: version,
  [generate.name]: generate,
  [help.name]: help,
};

module.exports = {
  Cli
};
