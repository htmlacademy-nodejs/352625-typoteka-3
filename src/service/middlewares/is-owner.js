'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (service, param) => (
  async (req, res, next) => {
    const match = await service.checkAuthorship(req.body[`${param}`], req.body[`userId`]);

    if (!match) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        data: req.body,
        errors: [{
          message: ErrorMessages.UNAUTHORIZED,
        }],
      });
      return;
    }

    next();
  }
);
