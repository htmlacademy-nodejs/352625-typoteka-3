'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);
const {Empty} = require(`./../routes/constants.js`);

const searchRouter = new Router();

const readFile = promisify(fs.readFile);

searchRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    const result = JSON.parse(fileContent)
      .filter((elem) => elem.title.includes(req.query.query)) || Empty.SEARCH;
    res.json(result);

  } catch (error) {
    res.json(Empty.SEARCH);
    console.error(`No content, ${error}`);
  }
});

module.exports = searchRouter;
