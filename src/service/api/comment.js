'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {passNotNullData, passProperParam, tryToResponse} = require(`../middlewares`);


module.exports = (app, commentService) => {
  const route = new Router();

  app.use(`/api/comments`, route);

  route.get(
      `/fresh`,
      passNotNullData(commentService.findFresh.bind(commentService), Empty.COMMENTS),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/byAuthor/:id`,
      passProperParam(`id`, Empty.COMMENTS),
      passNotNullData(commentService.findAllByAuthor.bind(commentService), Empty.COMMENTS, `id`),
      tryToResponse(HttpCode.OK),
  );


  route.delete(
      `/:commentId`,
      passProperParam(`commentId`, `Comment doesn't exist`),
      passNotNullData(commentService.findOne.bind(commentService), `Comment doesn't exist`, `commentId`),
      async (req, res, next) => {
        commentService.delete(req.param[`commentId`]);
        res.body = `Comment is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK),
  );
};
