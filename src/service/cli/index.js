'use strict';

const version = require(`./../cli/version.js`);
const generate = require(`./../cli/generate.js`);
const help = require(`./../cli/help.js`);
const server = require(`./../cli/server.js`);
const fill = require(`./../cli/fill.js`);
const dbConnect = require(`./../cli/db-connect.js`);

const Cli = {
  [version.name]: version,
  [generate.name]: generate,
  [help.name]: help,
  [server.name]: server,
  [fill.name]: fill,
  [dbConnect.name]: dbConnect,
};

module.exports = {
  Cli
};
