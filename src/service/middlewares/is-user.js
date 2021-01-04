'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (userService) => (
  async (req, res, next) => {
    const user = await userService.isUser(req.body[`userId`]);

    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        data: req.body,
        errors: [{
          message: ErrorMessages.USER_NOT_EXIST,
        }],
      });
      return;
    }

    next();
  }
);
