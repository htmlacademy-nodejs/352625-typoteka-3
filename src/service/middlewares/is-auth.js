'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (service) => (
  async (req, res, next) => {
    const auth = await service();

    if (!auth.status) {
      res.status(HttpCode.UNAUTHORIZED).send(`Unauthorized access`);
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }
    res.body = auth;

    next();
  }
);
