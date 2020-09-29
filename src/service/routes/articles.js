'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);
const getMock = require(`./../mocks-data.js`);
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
    const result = await getMock();

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
    } else {
      res.json(result);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const data = await getMock();
    const result = data
      .find((elem) => elem.id === req.params.articleId);

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLE);
    } else {
      res.json(result);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLE);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const data = await getMock();
    const targetArticle = data
      .find((elem) => elem.id === req.params.articleId);

    if (!targetArticle) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    } else {
      const result = targetArticle.comments;
      res.json(result);
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
    const data = await getMock();
    const result = data
      .find((elem) => elem.id === req.params.articleId);

    if (!result) {
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
    const data = await getMock();
    const result = data
      .find((elem) => elem.id === req.params.articleId);

    if (!validateComment() || !result) {
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
    const data = await getMock();
    const result = data
      .find((elem) => elem.id === req.params.articleId);

    if (!result) {
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
    const data = await getMock();
    const targetArticle = data
      .find((elem) => elem.id === req.params.articleId);

    if (!targetArticle) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid article ID`);

    } else {
      const targetComment = targetArticle.comments
        .find((elem) => elem.id === req.params.commentId);

      if (!targetComment) {
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
