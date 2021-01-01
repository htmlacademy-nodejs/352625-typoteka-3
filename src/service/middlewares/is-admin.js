'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (userService) => (
  async (req, res, next) => {
    const admin = await userService.isAdmin(req.body[`userId`]);

    if (!admin) {
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
