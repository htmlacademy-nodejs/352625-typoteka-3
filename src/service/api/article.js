'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const isData = require(`../middlewares/is-data.js`);
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
      isData(articleService.findAll.bind(articleService), Empty.ARTICLES),
      (req, res) => {
        res.status(HttpCode.OK).json(res.body);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.get(
      `/mostDiscussed`,
      isData(articleService.findMostDiscussed.bind(articleService), Empty.ARTICLES),
      (req, res) => {
        res.status(HttpCode.OK).json(res.body);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.get(
      `/fresh`,
      (req, res) => res.redirect(`/api/articles/fresh/page=1`)
  );

  route.get(
      `/fresh/page=:pageNumber`,
      isData(articleService.findFresh.bind(articleService), Empty.ARTICLES, `pageNumber`),
      (req, res) => {
        // let data = null;
        // const pageNumber = parseInt(req.params.pageNumber, 10);
        //
        // if (pageNumber > 0) {
        //   data = await await articleService.findFresh(pageNumber);
        // }

        res.status(HttpCode.OK).json(res.body);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.get(
      `/byAuthor/:authorId`,
      isData(articleService.findAllByAuthor.bind(articleService), Empty.ARTICLES, `authorId`),
      (req, res) => {
        // let data = null;
        // const userId = parseInt(req.params.id, 10);
        //
        // if (userId) {
        //   data = await articleService.findAllByAuthor(userId);
        // }

        res.status(HttpCode.OK).json(res.body);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.get(
      `/:articleId`,
      isData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      (req, res) => {
        // let data = null;
        // const articleId = parseInt(req.params.articleId, 10);
        //
        // if (articleId) {
        //   data = await articleService.findOne(articleId);
        // }

        res.status(HttpCode.OK).json(res.body);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.post(`/`, async (req, res) => {
    try {
      const auth = await authService.get();

      if (!validateArticle() || !auth.status) {
        res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
      } else {
        await articleService.add(req.body, auth.user.id);
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
      isData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      async (req, res) => {
        // let data = null;
        // const articleId = parseInt(req.params.articleId, 10);
        //
        // if (articleId) {
        //   data = await articleService.findOne(articleId);
        // }

        if (res.body) {
          await articleService.update(req.body, req.params.articleId);
          res.status(HttpCode.OK).send(req.body);

        } else {
          res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
        }
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });


  route.post(`/:articleId/comments`, async (req, res) => {
    try {
      const articleId = parseInt(req.params.articleId, 10);
      const auth = await authService.get();

      if (validateComment() && auth.status && Number.isInteger(articleId)) {
        await commentService.add(req.body, articleId, auth.user.id);
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
      isData(articleService.findOne.bind(articleService), Empty.ARTICLE, `articleId`),
      async (req, res) => {
        // let data = null;
        // const articleId = parseInt(req.params.articleId, 10);
        //
        // if (articleId) {
        //   data = await articleService.findOne(articleId);
        // }

        if (res.body) {
          await articleService.delete(req.params.articleId);
          res.status(HttpCode.OK).send(`Article is deleted`);

        } else {
          res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
        }

        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
      });
};
