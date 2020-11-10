'use strict';

const {HttpCode} = require(`./../cli/constants.js`);

module.exports = (param, mock) => (
  (req, res, next) => {
    const properParam = parseInt(req.params[`${param}`], 10);

    if (!properParam || properParam < 0) {
      res.status(HttpCode.BAD_REQUEST).json(mock);
    }

    next();
  }
);
