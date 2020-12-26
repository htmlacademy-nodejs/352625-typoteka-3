'use strict';

const {HttpCode} = require(`./../cli/constants.js`);

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
          message: `Такого пользователя не существует`,
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
          message: `Невалидный пароль`,
        }],
      });
      return;
    }
    res.body = `User is authenticated`;

    next();
  }
);
