'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const articlesRouter = new Router();

articlesRouter.use(express.json());


const validateArticle = () => {
  // TODO: validating code is coming soon...
  return true;
};

const validateComment = () => {
  // TODO: validating code is coming soon...
  return true;
};


articlesRouter.get(`/`, async (req, res) => {
  try {
    const data = await db.Article.findAll({raw: true});

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const data = await db.Article.findByPk(req.params.articleId, {
      include: [`author`, `comments`, `categories`],
    });

    if (!data) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLE);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLE);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const data = await db.Comment.findAll({
      where: {
        [`article_id`]: req.params.articleId
      },
      raw: true
    });

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.post(`/`, (req, res) => {
  try {
    if (!validateArticle()) {
      res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
    } else {
      // TODO: some code for adding new article is coming soon...
      res.send(req.body);

      // TODO: TEMP observe receiving FormData of newTicket:
      logger.info(req.body);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.put(`/:articleId`, async (req, res) => {
  try {
    const data = await db.Article.findByPk(req.params.articleId, {raw: true});

    if (!data) {
      res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
    } else {
      // TODO: some code for editing article is coming soon...
      res.send(req.body);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.put(`/:articleId/comments`, async (req, res) => {
  try {
    const data = await db.Comment.findAll({
      where: {
        [`article_id`]: req.params.articleId
      },
      raw: true
    });

    if (!validateComment() || !data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).send(Empty.COMMENT);
    } else {
      // TODO: some code for adding new comment is coming soon...
      res.send(req.body);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.delete(`/:articleId`, async (req, res) => {
  try {
    const data = await db.Article.findByPk(req.params.articleId, {raw: true});

    if (!data) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid Article ID`);
    } else {
      // TODO: some code for deleting Article is coming soon...
      res.send(`Article is deleted`);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  try {
    const comment = await db.Comment.findByPk(req.params.commentId, {raw: true});
    const article = await db.Article.findByPk(req.params.articleId, {raw: true});

    if (!article) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid article ID`);

    } else {

      if (!comment) {
        res.status(HttpCode.BAD_REQUEST).send(`Invalid comment ID`);

      } else {
        // TODO: some code for deleting comment is coming soon...
        res.send(`Comment is deleted`);
      }
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = articlesRouter;
