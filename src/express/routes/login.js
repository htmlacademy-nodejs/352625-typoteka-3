'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const loginRouter = new Router();

loginRouter.get(`/`, async (req, res) => {
  try {
    const auth = await api.getAuth();

    res.render(`login`, {auth});
  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = loginRouter;
