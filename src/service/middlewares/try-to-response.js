'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (code, mock = null) => (
  async (req, res) => {
    try {
      res.status(code).json(res.body);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(mock ? mock : error);
      logger.error(`Error occurs: ${error}`);
    }
  });
