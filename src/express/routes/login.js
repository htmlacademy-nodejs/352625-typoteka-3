'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);
const {setDefaultAuthStatus} = require(`../middlewares`);

const logger = getLogger();

const loginRouter = new Router();

loginRouter.get(`/`, setDefaultAuthStatus(), async (req, res) => {
  try {
    res.render(`login`, {
      auth: req.session[`auth`],
      data: null,
      errors: null,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

loginRouter.post(`/`, async (req, res) => {
  try {
    req.session[`auth`] = await api.login(req.body);
    res.redirect(`/`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(error.response.data[`status`]).render(`login`, {
      auth: req.session[`auth`],
      data: error.response.data[`data`],
      errors: error.response.data[`errors`],
    });
    logger.error(`Error occurs: ${error}`);

  }
});

module.exports = loginRouter;
