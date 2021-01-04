'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email} = req.body;
    const existsUser = await service.findByEmail(email);

    if (existsUser) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        data: req.body,
        errors: [{
          label: `email`,
          message: ErrorMessages.EMAIL_EXIST,
        }],
      });
      return;
    }

    next();
  }
);
