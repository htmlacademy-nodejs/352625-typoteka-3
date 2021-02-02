'use strict';

const {HttpCode} = require(`./../cli/constants.js`);
const {ErrorMessages} = require(`../schemas/constants.js`);

module.exports = (commentService) => (
  async (req, res, next) => {
    const comment = await commentService.findOne(req.body[`commentId`]);

    if (!comment) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        data: req.body,
        errors: [{
          message: ErrorMessages.COMMENT_NOT_EXIST,
        }],
      });
      return;
    }

    next();
  }
);
