'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
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

  route.get(`/`, async (req, res) => {
    try {
      const data = await articleService.findAll();

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/mostDiscussed`, async (req, res) => {
    try {
      const data = await articleService.findMostDiscussed();

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/fresh`, async (req, res) => {
    try {
      const data = await articleService.findFresh();

      if (!data || data.length === 0) {
        res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
      } else {
        res.status(HttpCode.OK).json(data);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/byAuthor/:id`, async (req, res) => {
    try {
      let data = null;
      const userId = parseInt(req.params.id, 10);

      if (userId) {
        data = await articleService.findAllByAuthor(userId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);

      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
      logger.error(`Error occurs: ${error}`);
    }
  });


  route.get(`/:articleId`, async (req, res) => {
    try {
      let data = null;
      const articleId = parseInt(req.params.articleId, 10);

      if (articleId) {
        data = await articleService.findOne(articleId);
      }

      if (data) {
        res.status(HttpCode.OK).json(data);

      } else {
        res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLE);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLE);
      logger.error(`Error occurs: ${error}`);
    }
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


  // TODO не получилось реализвать редактирование поста через метод PUT
  route.put(`/:articleId`, async (req, res) => {
    try {
      let data = null;
      const articleId = parseInt(req.params.articleId, 10);

      if (articleId) {
        data = await articleService.findOne(articleId);
      }

      if (data) {
        await articleService.update(req.body, articleId);
        res.status(HttpCode.OK).send(req.body);

      } else {
        res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
      }
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
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


  route.delete(`/:articleId`, async (req, res) => {
    try {
      let data = null;
      const articleId = parseInt(req.params.articleId, 10);

      if (articleId) {
        data = await articleService.findOne(articleId);
      }

      if (data) {
        await articleService.delete(articleId);
        res.status(HttpCode.OK).send(`Article is deleted`);

      } else {
        res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
      }

      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
      logger.error(`Error occurs: ${error}`);
    }
  });
};
