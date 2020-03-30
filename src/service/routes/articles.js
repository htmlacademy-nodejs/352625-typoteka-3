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


module.exports = articlesRouter;
