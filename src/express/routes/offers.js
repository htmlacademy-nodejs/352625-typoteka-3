'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

const OFFERS_PATH_NAME = `offers`;
const OFFER_ID = `offerId`;

offersRouter.get(
    `/add`,
    (req, res) => res.send(`/${OFFERS_PATH_NAME}/add`)
);

offersRouter.get(
    `/category/:${OFFER_ID}`,
    (req, res) => res.send(`/${OFFERS_PATH_NAME}/category/${req.params[OFFER_ID]}`)
);

offersRouter.get(
    `/edit/:${OFFER_ID}`,
    (req, res) => res.send(`/${OFFERS_PATH_NAME}/edit/${req.params[OFFER_ID]}`)
);

offersRouter.get(
    `/:${OFFER_ID}`,
    (req, res) => res.send(`/${OFFERS_PATH_NAME}/${req.params[OFFER_ID]}`)
);

module.exports = {
  OFFERS_PATH_NAME,
  offersRouter,
};
