'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const registerRouter = new Router();

registerRouter.get(`/`, async (req, res) => {
  try {
    const auth = await api.getAuth();

    res.render(`sign-up`, {auth});
  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = registerRouter;
