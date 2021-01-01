'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email} = req.body;
    const existsUser = await service.findByEmail(email);

    if (!existsUser) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        data: req.body,
        errors: [{
          label: `email`,
          message: ErrorMessages.USER_NOT_EXIST,
        }],
      });
      return;
    }

    const match = await service.checkUser(existsUser, req.body);

    if (!match) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        data: req.body,
        errors: [{
          label: `password`,
          message: ErrorMessages.INVALID_PASSWORD,
        }],
      });
      return;
    }
    res.body = await service.getAuth(email);

    next();
  }
);
