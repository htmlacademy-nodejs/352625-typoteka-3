'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

module.exports = (schema, isUserExist) => (
  async (req, res, next) => {
    const {body} = req;
    let existEmail = null;
    const user = await isUserExist(body.email);

    if (user) {
      existEmail = user.dataValues.email;
    }

    try {
      await schema(existEmail).validateAsync(body, {
        abortEarly: false
      });
    } catch (err) {
      const {details} = err;

      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data: body,
        errors: details.map((errorDescription) => ({
          label: errorDescription.context.label,
          message: errorDescription.message,
        })),
      });

      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      return;
    }

    next();
  }
);
