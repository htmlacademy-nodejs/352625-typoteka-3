'use strict';

const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const authRouter = new Router();

authRouter.get(`/`, async (req, res) => {
  try {
    const authData = await db.Auth.findAll({
      where: {
        [`is_auth`]: true
      },
      raw: true
    });

    const result = {
      status: authData.length === 0 ? false : authData[0][`is_auth`],
      userId: authData.length === 0 ? null : authData[0][`id`],
    };

    res.json(result);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = authRouter;
