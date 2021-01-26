'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {passNotNullData, tryToResponse, isOwner} = require(`../middlewares`);


module.exports = (app, commentService) => {
  const route = new Router();

  app.use(`/api/comments`, route);

  route.get(
      `/fresh`,
      passNotNullData(commentService.findFresh.bind(commentService), Empty.COMMENTS),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/`,
      passNotNullData(commentService.findAll.bind(commentService), Empty.COMMENTS),
      tryToResponse(HttpCode.OK),
  );


  route.delete(
      `/`,
      isOwner(commentService, `commentId`),
      async (req, res, next) => {
        const {commentId, userId} = req.body;
        commentService.delete(commentId, userId);
        res.body = `Comment is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK),
  );
};
