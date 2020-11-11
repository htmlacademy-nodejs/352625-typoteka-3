'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);

const passNotNullData = require(`../middlewares/pass-not-null-data.js`);
const passProperParam = require(`../middlewares/pass-proper-param.js`);
const executeRoute = require(`../middlewares/execute-route.js`);
const isAuth = require(`../middlewares/is-auth.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const validateArticle = () => {
  // TODO: validating code is coming soon...
  return true;
};

const validateComment = () => {
  // TODO: validating code is coming soon...
  return true;
};


module.exports = (app, articleService, authService, commentService) => {
  const route = new Router();

  app.use(`/api/articles`, route);

  route.get(
      `/`,
      passNotNullData(articleService.findAll.bind(articleService), Empty.ARTICLES),
      executeRoute(Empty.ARTICLES)
  );


  route.get(
      `/mostDiscussed`,
      passNotNullData(articleService.findMostDiscussed.bind(articleService), Empty.ARTICLES),
      executeRoute(Empty.ARTICLES)
  );


  route.get(
      `/fresh`,
      (req, res) => res.redirect(`/api/articles/fresh/page=1`)
  );

  route.get(
      `/fresh/page=:pageNumber`,
      passProperParam(`pageNumber`, Empty.ARTICLES),
      passNotNullData(articleService.findFresh.bind(articleService), Empty.ARTICLES, `pageNumber`),
      executeRoute(Empty.ARTICLES)
  );


  route.get(
      `/byAuthor/:authorId`,
      passProperParam(`authorId`, Empty.ARTICLES),
      passNotNullData(articleService.findAllByAuthor.bind(articleService), Empty.ARTICLES, `authorId`),
      executeRoute(Empty.ARTICLES)
  );


  route.get(
      `/:articleId`,
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      executeRoute(Empty.ARTICLE)
  );


  route.post(
      `/`,
      isAuth(authService.get.bind(authService)),
      async (req, res) => {
        try {
          if (!validateArticle()) {
            res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
          } else {
            await articleService.add(req.body, res.body.user.id);
            res.status(HttpCode.OK).send(req.body);
          }
          logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

        } catch (error) {
          res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
          logger.error(`Error occurs: ${error}`);
        }
      });


  route.put(
      `/:articleId`,
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      async (req, res) => {

        if (res.body) {
          await articleService.update(req.body, req.params.articleId);
          res.status(HttpCode.OK).send(req.body);

        } else {
          res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
        }
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.post(
      `/:articleId/comments`,
      passProperParam(`articleId`, Empty.COMMENT),
      isAuth(authService.get.bind(authService)),
      async (req, res) => {
        try {

          if (validateComment()) {
            await commentService.add(req.body, req.params.articleId, res.body.user.id);
            res.status(HttpCode.OK).send(req.body);

          } else {
            res.status(HttpCode.BAD_REQUEST).send(Empty.COMMENT);
          }
          logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

        } catch (error) {
          res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
          logger.error(`Error occurs: ${error}`);
        }
      });


  route.delete(
      `/:articleId`,
      passProperParam(`articleId`, Empty.ARTICLE),
      passNotNullData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      async (req, res) => {

        if (res.body) {
          await articleService.delete(req.params.articleId);
          res.status(HttpCode.OK).send(`Article is deleted`);

        } else {
          res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
        }

        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });
};
