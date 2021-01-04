'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (articleService) => (
  async (req, res, next) => {
    const article = await articleService.findOne(req.body[`articleId`]);

    if (!article) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data: req.body,
        errors: [{
          message: ErrorMessages.ARTICLE_NOT_EXIST,
        }],
      });
      return;
    }

    next();
  }
);
