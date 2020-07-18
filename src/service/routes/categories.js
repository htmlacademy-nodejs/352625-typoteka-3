'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`./../cli/constants.js`);
const {Empty, PathName} = require(`./../routes/constants.js`);
const {createLogs, createErrorLogs} = require(`./../utils.js`);
const getMock = require(`./../mocks-data.js`);

const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  try {
    const data = await getMock();

    const result = [...(new Set(data
      .map((elem) => elem.category || Empty.DATA).flat()
      .map((category) => JSON.stringify(category))
    ))].map((text) => JSON.parse(text));

    if (result === [Empty.DATA]) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.CATEGORIES);
      createLogs(req, res, PathName.CATEGORIES);
    } else {
      res.json(result);
      createLogs(req, res, PathName.CATEGORIES);
    }

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    createErrorLogs(error);
  }
});

module.exports = categoriesRouter;
