'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const makeCategoriesValid = (article) => {
  if (!article.categories) {
    article.categories = [];
  }
  if (article.categories && article.categories.length === 1) {
    article.categories = [parseInt(article.categories, 10)];
  }
  if (article.categories && article.categories.length > 1) {
    article.categories = article.categories.map((item) => parseInt(item, 10));
  }
  return article;
};

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;
    const data = makeCategoriesValid(body);
    console.log(data);

    try {
      await schema.validateAsync(body, {
        abortEarly: false
      });
    } catch (err) {
      const {details} = err;
      console.log(details);

      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data,
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
