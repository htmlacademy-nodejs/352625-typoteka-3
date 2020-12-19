'use strict';

const {Router} = require(`express`);

const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {checkApiReply, uploadFile, saveFileNameToBody} = require(`../middlewares`);

const registerRouter = new Router();

registerRouter.get(`/`, checkApiReply(), async (req, res) => {
  try {
    const auth = await api.getAuth();
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

    res.render(`sign-up`, {
      auth,
      data: req.apiData,
      errors: req.apiErrors,
    });
  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});

registerRouter.post(`/`, uploadFile.single(`avatar`), saveFileNameToBody(`avatar`), async (req, res) => {
  try {
    await api.register(req.body);
    res.redirect(`/login`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    console.log(error.response.data);
    res.redirect(`/register?data=${JSON.stringify(error.response.data)}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = registerRouter;
