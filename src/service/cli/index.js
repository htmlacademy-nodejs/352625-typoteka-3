'use strict';

const version = require(`./../cli/version.js`);
const help = require(`./../cli/help.js`);
const server = require(`./../cli/server.js`);
const dbConnect = require(`./../cli/db-connect.js`);
const filldb = require(`./../cli/filldb.js`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [server.name]: server,
  [dbConnect.name]: dbConnect,
  [filldb.name]: filldb,
};

module.exports = {
  Cli
};
