'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);

const categoriesRouter = new Router();

const readFile = promisify(fs.readFile);

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = Array
      .from(new Set(JSON.parse(fileContent).map((elem) => elem.category[0] || Empty.DATA)));

    if (result === [Empty.DATA]) {
      res.json(Empty.CATEGORIES);
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error(`No content, ${error}`);
  }
});

module.exports = categoriesRouter;
