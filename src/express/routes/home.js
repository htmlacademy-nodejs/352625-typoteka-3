'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const homeRouter = new Router();

homeRouter.get(`/page=:pageNumber`, async (req, res) => {
  try {
    const pageNumber = req.params.pageNumber;

    const [
      auth,
      categories,
      mostDiscussedItems,
      fresh,
      lastComments,
    ] = await Promise.all([
      api.getAuth(),
      api.getCategories(),
      api.getMostDiscussed(),
      api.getFreshItems(pageNumber),
      api.getFreshComments(),
    ]);

    res.render(`main`, {
      auth,
      categories,
      mostDiscussedItems,
      lastComments,
      fresh,
      getHumanDate,
      pageNumbers: getPageNumbers(fresh.totalPages),
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

homeRouter.get(`/`, (req, res) => res.redirect(`/page=1`));

module.exports = homeRouter;
