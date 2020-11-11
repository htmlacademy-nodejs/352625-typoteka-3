'use strict';

const {HttpCode} = require(`./../cli/constants.js`);

module.exports = (service, mock, param = null) => (
  async (req, res, next) => {
    const data = await service(req.params[`${param}`]);

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(mock);
    }

    res.body = data;

    next();
  }
);
