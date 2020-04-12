'use strict';

const express = require(`express`);
const {Router} = require(`express`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const {FILE_NAME, HttpCode} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {createLogs, createErrorLogs} = require(`./../utils.js`);

const articlesRouter = new Router();

articlesRouter.use(express.json());

const readFile = promisify(fs.readFile);


const validateArticle = () => {
  // validating code is coming soon...
  return true;
};

const validateComment = () => {
  // validating code is coming soon...
  return true;
};


articlesRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent);

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.OFFERS);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      res.json(result);
      createLogs(req, res, PathName.ARTICLES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.ARTICLE);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      res.json(result);
      createLogs(req, res, PathName.ARTICLES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetArticle = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!targetArticle) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      const result = targetArticle.comments;
      createLogs(req, res, PathName.ARTICLES);
      res.json(result);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.post(`/`, async (req, res) => {
  try {
    if (!validateArticle()) {
      res.status(HttpCode.BAD_REQUEST).send(`Incorrect article format`);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      // some code for adding new article is coming soon...
      res.send(req.body);
      createLogs(req, res, PathName.ARTICLES);
    }
  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.put(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).send(Empty.ARTICLE);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      // some code for editing article is coming soon...
      res.send(req.body);
      createLogs(req, res, PathName.ARTICLES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.put(`/:articleId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!validateComment() || !result) {
      res.status(HttpCode.BAD_REQUEST).send(Empty.COMMENT);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      // some code for adding new comment is coming soon...
      res.send(req.body);
      createLogs(req, res, PathName.ARTICLES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.delete(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid Article ID`);
      createLogs(req, res, PathName.ARTICLES);
    } else {
      // some code for deleting Article is coming soon...
      res.send(`Article is deleted`);
      createLogs(req, res, PathName.ARTICLES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetArticle = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!targetArticle) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid article ID`);
      createLogs(req, res, PathName.ARTICLES);

    } else {
      const targetComment = targetArticle.comments
        .filter((elem) => elem.id === req.params.commentId)[0];

      if (!targetComment) {
        res.status(HttpCode.BAD_REQUEST).send(`Invalid comment ID`);
        createLogs(req, res, PathName.ARTICLES);

      } else {
        // some code for deleting comment is coming soon...
        res.send(`Comment is deleted`);
        createLogs(req, res, PathName.ARTICLES);
      }
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

module.exports = articlesRouter;
