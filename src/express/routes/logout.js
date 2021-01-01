'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const {getLogger} = require(`./../../service/logger.js`);
const {setDefaultAuthStatus} = require(`../middlewares`);

const logger = getLogger();

const logoutRouter = new Router();

logoutRouter.post(`/`, setDefaultAuthStatus(), async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect(`/login`);
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = logoutRouter;
