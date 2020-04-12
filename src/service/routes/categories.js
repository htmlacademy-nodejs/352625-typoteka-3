'use strict';

const {Router} = require(`express`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const {FILE_NAME, HttpCode} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {createLogs, createErrorLogs} = require(`./../utils.js`);

const categoriesRouter = new Router();

const readFile = promisify(fs.readFile);

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = Array
      .from(new Set(JSON.parse(fileContent).map((elem) => elem.category[0] || Empty.DATA)));

    if (result === [Empty.DATA]) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORIES);
      createLogs(req, res, PathName.CATEGORIES);
    } else {
      res.json(result);
      createLogs(req, res, PathName.CATEGORIES);
    }

  } catch (error) {
    createErrorLogs(error);
  }
});

module.exports = categoriesRouter;
