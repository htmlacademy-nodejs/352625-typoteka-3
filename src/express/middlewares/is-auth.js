'use strict';

const {HttpCode} = require(`../../service/cli/constants.js`);
const {getLogger} = require(`../../service/logger.js`);

const logger = getLogger();

module.exports = (service) => (
  async (req, res, next) => {
    const auth = await service();

    if (auth.status === false) {
      res.status(HttpCode.UNAUTHORIZED).render(`login`, {auth});
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }
    res.auth = auth;

    next();
  }
);
