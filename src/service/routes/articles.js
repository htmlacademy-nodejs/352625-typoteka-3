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

    if (!result) {
      res.status(400).json(Empty.OFFERS);
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!result) {
      res.status(400).json(Empty.ARTICLE);
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetArticle = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!targetArticle) {
      res.status(400).json(Empty.COMMENTS);
    } else {
      const result = targetArticle.comments;
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.post(`/`, async (req, res) => {
  try {
    if (!validateArticle()) {
      res.status(400).send(`Incorrect article format`);
    } else {
      // some code for adding new article is coming soon...
      res.send(req.body);
    }
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
      res.status(400).send(Empty.ARTICLE);
    } else {
      // some code for editing article is coming soon...
      res.send(req.body);
    }

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
      res.status(400).send(Empty.COMMENT);
    } else {
      // some code for adding new comment is coming soon...
      res.send(req.body);
    }

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
    } else {
      // some code for deleting Article is coming soon...
      res.send(`Article is deleted`);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const targetArticle = JSON.parse(fileContent)
      .filter((elem) => elem.id === req.params.articleId)[0];

    if (!targetArticle) {
      res.status(400).send(`Invalid article ID`);

    } else {
      const targetComment = targetArticle.comments
        .filter((elem) => elem.id === req.params.commentId)[0];

      if (!targetComment) {
        res.status(400).send(`Invalid comment ID`);

      } else {
        // some code for deleting comment is coming soon...
        res.send(`Comment is deleted`);
      }
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

module.exports = articlesRouter;
