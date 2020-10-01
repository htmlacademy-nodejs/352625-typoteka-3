'use strict';

const {Router} = require(`express`);

const {db} = require(`./../../../db/db.js`);
const {HttpCode} = require(`./../cli/constants.js`);
const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const authRouter = new Router();

authRouter.get(`/`, async (req, res) => {
  try {
    const authData = await db.Auth.findOne({
      where: {
        [`is_auth`]: true
      },
      include: [`user`],
    });

    let result;

    if (!authData) {

      result = {
        status: false,
        user: null,
        avatar: null,
      };

    } else {
      const userAvatar = await db.Avatar.findOne({
        where: {
          [`id`]: authData.user[`avatar_id`]
        }
      });

      result = {
        status: authData[`is_auth`],
        user: authData[`user`],
        avatar: userAvatar,
      };
    }

    res.json(result);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(`${error}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = authRouter;
