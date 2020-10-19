'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => {
  try {
    const auth = await api.getAuth();

    const searchRequest = req.query.search;
    let result = null;

    if (searchRequest !== undefined) {
      result = await api.search(req.query.search);
    }

    res.render(`search`, {
      auth,
      result,
      searchRequest,
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = searchRouter;
