'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const homeRouter = new Router();

homeRouter.get(`/`, async (req, res) => {
  try {
    const [
      auth,
      categories,
      mostDiscussedItems,
      freshItems,
      lastComments,
    ] = await Promise.all([
      api.getAuth(),
      api.getCategories(),
      api.getMostDiscussed(),
      api.getFreshItems(),
      api.getFreshComments(),
    ]);

    res.render(`main`, {
      auth,
      categories,
      mostDiscussedItems,
      lastComments,
      freshItems,
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = homeRouter;
