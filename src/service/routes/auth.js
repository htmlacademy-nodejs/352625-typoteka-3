'use strict';

const {Router} = require(`express`);

const getAuth = require(`./utils/auth.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const authRouter = new Router();

authRouter.get(`/`, async (req, res) => {
  try {
    const data = await getAuth();

    res.json(data);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = authRouter;
