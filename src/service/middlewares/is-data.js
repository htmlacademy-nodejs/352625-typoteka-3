'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (service, mock, param = null) => (
  async (req, res, next) => {
    try {
      console.log(req.params);
      const data = await service(req.params[`${param}`]);

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(mock);
      }

      res.body = data;

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(mock);
      logger.error(`Error occurs: ${error}`);
    }

    next();
  }
);
