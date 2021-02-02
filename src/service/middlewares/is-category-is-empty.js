'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (categoryService) => (
  async (req, res, next) => {
    const totalArticlesCount = parseInt((
      await categoryService.getArticlesCount(req.body[`categoryId`])
    )[`dataValues`][`totalArticles`], 10);

    if (totalArticlesCount) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data: req.body,
        errors: [{
          message: ErrorMessages.CATEGORY_IS_NOT_EMPTY,
          label: `category`,
        }],
      });
      return;
    }

    next();
  }
);
