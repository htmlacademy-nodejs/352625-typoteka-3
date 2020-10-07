'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const {getArticles, getArticlesByUserId} = require(`./utils/articles.js`);
const {getArticle, addArticle, updateArticle} = require(`./utils/article.js`);
const getAuth = require(`./utils/auth.js`);
const getMostDiscussed = require(`./utils/most-discussed.js`);
const getFreshItems = require(`./utils/fresh-items.js`);
const {addComment} = require(`./utils/comment.js`);

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
    const data = await getArticles();

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

articlesRouter.get(`/mostDiscussed`, async (req, res) => {
  try {
    const data = await getMostDiscussed();

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

articlesRouter.get(`/fresh`, async (req, res) => {
  try {
    const data = await getFreshItems();

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

articlesRouter.get(`/byUser/:id`, async (req, res) => {
  try {
    let data = null;
    const userId = parseInt(req.params.id, 10);

    if (userId) {
      data = await getArticlesByUserId(userId);
    }

    if (data) {
      res.json(data);

    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLES);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLES);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    let data = null;
    const articleId = parseInt(req.params.articleId, 10);

    if (articleId) {
      data = await getArticle(articleId);
    }

    if (data) {
      res.json(data);

    } else {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLE);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.ARTICLE);
    logger.error(`Error occurs: ${error}`);
  }
});

articlesRouter.post(`/`, async (req, res) => {
  try {
    const auth = await getAuth();

    if (!validateArticle() || !auth.status) {
      res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
    } else {
      await addArticle(req.body, auth.user.id);
      res.status(HttpCode.OK).send(req.body);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

// TODO не получилось реализвать редактирование поста через метод PUT
articlesRouter.post(`/:articleId`, async (req, res) => {
  try {
    let data = null;
    const articleId = parseInt(req.params.articleId, 10);

    if (articleId) {
      data = await getArticle(articleId);
    }

    if (data) {
      await updateArticle(req.body, articleId);
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

articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    const auth = await getAuth();

    if (validateComment() && auth.status && Number.isInteger(articleId)) {
      await addComment(req.body, articleId, auth.user.id);
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

articlesRouter.delete(`/:articleId`, async (req, res) => {
  try {
    let data = null;
    const articleId = parseInt(req.params.articleId, 10);

    if (articleId) {
      data = await db.Article.findByPk(articleId, {raw: true});
    }

    if (data) {
      // TODO: some code for deleting Article is coming soon...
      res.send(`Article is deleted`);

    } else {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid Article ID`);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = articlesRouter;
