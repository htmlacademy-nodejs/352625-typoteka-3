'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {passNotNullData, tryToResponse, isUser, isAdmin, isComment} = require(`../middlewares`);


module.exports = (app, commentService, userService) => {
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
      isUser(userService),
      isComment(commentService),
      isAdmin(userService),
      async (req, res, next) => {
        const {commentId} = req.body;
        commentService.delete(commentId);
        res.body = `Comment is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK),
  );
};
