'use strict';

const {Router} = require(`express`);

const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME} = require(`./../cli/constants.js`);

const homeRouter = new Router();

homeRouter.get(`/`, async (req, res) => {
  try {
    const readFile = promisify(fs.readFile);
    const fileContent = await readFile(FILE_NAME);
    res.json(JSON.parse(fileContent));

  } catch (error) {
    res.json([]);
    console.error(`No content, ${error}`);
  }
});

module.exports = homeRouter;
