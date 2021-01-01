'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);

const {
  passNotNullData,
  passProperParam,
  tryToResponse,
  makeCategoriesValid,
  schemaValidator,
  isArticle,
  isAdmin,
  isOwner,
  isUser,
} = require(`../middlewares`);

const articleSchema = require(`../schemas/article.js`);
const commentSchema = require(`../schemas/comment.js`);

module.exports = (app, articleService, commentService, userService) => {
  const route = new Router();

  app.use(`/api/articles`, route);


  route.get(
      `/`,
      passNotNullData(articleService.findAll.bind(articleService), Empty.ARTICLES),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/mostDiscussed`,
      passNotNullData(articleService.findMostDiscussed.bind(articleService), Empty.ARTICLES),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/fresh`,
      (req, res) => res.redirect(`/api/articles/fresh/page=1`)
  );


  route.get(
      `/fresh/page=:pageNumber`,
      passProperParam(`pageNumber`, Empty.ARTICLES),
      passNotNullData(articleService.findFresh.bind(articleService), Empty.ARTICLES, `pageNumber`),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/byAuthor/:authorId`,
      passProperParam(`authorId`, Empty.ARTICLES),
      passNotNullData(articleService.findAllByAuthor.bind(articleService), Empty.ARTICLES, `authorId`),
      tryToResponse(HttpCode.OK, Empty.ARTICLES)
  );


  route.get(
      `/:articleId`,
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      tryToResponse(HttpCode.OK, Empty.ARTICLE)
  );


  route.post(
      `/`,
      isUser(userService),
      isAdmin(userService),
      makeCategoriesValid(),
      schemaValidator(articleSchema),
      async (req, res, next) => {
        const {createdDate, title, categories, announce, fullText, picture, pictureFilename, userId} = req.body;
        await articleService.add({createdDate, title, categories, announce, fullText, picture, pictureFilename, userId});
        res.body = `Article is added`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/`,
      isUser(userService),
      isOwner(articleService, `articleId`),
      makeCategoriesValid(),
      schemaValidator(articleSchema),
      async (req, res, next) => {
        const {createdDate, title, categories, announce, fullText, picture, pictureFilename, userId, articleId} = req.body;
        await articleService.update({createdDate, title, categories, announce, fullText, picture, pictureFilename, userId, articleId});
        res.body = `Article is changed`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.post(
      `/comments`,
      isUser(userService),
      isArticle(articleService),
      schemaValidator(commentSchema),
      async (req, res, next) => {
        const {userId, articleId, text} = req.body;
        await commentService.add({userId, articleId, text});
        res.body = `Comment is added`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/`,
      isOwner(articleService, `articleId`),
      async (req, res, next) => {
        const {articleId, userId} = req.body;
        await articleService.delete(articleId, userId);
        res.body = `Article is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
