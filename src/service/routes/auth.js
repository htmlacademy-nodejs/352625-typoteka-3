'use strict';

const {Router} = require(`express`);

const getAuth = require(`./../routes/utils.js`);
const {PathName, AUTH_STATUS} = require(`./../routes/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const authRouter = new Router();

authRouter.get(`/`, async (req, res) => {
  try {
    const authData = await getAuth(AUTH_STATUS);

    res.json(authData);
    logger.debug(`${req.method} /${PathName.AUTH} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = authRouter;
