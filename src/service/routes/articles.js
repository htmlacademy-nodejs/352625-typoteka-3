'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);

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
    res.json(result);

  } catch (error) {
    res.json(Empty.ARTICLES);
    console.error(`No content, ${error}`);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0] || Empty.ARTICLE;
    res.json(result);

  } catch (error) {
    res.json(Empty.ARTICLE);
    console.error(`No content, ${error}`);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0].comments || Empty.ARTICLE;
    res.json(result);

  } catch (error) {
    res.json(Empty.ARTICLE);
    console.error(`No content, ${error}`);
  }
});

articlesRouter.post(`/`, async (req, res) => {
  try {
    if (!validateArticle()) {
      res.status(400).send(`Incorrect Article format`);
    }
    // some code for adding new Article is coming soon...

    res.send(req.body);

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.put(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(400).send(`Invalid Article ID`);
    }
    // some code for editing Article is coming soon...

    res.send(req.body);

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.put(`/:articleId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!validateComment() || !result) {
      res.status(400).send(`Invalid Article ID`);
    }
    // some code for adding new comment is coming soon...

    res.send(req.body);

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.delete(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(400).send(`Invalid Article ID`);
    }
    // some code for deleting Article is coming soon...

    res.send(`Article is deleted`);

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0].comments
      .filter((elem) => elem.id === req.params.commentId)[0];

    if (!result) {
      res.status(400).send(`Cannot find comment`);
    }
    // some code for deleting comment is coming soon...

    res.send(`Comment is deleted`);

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

module.exports = articlesRouter;
