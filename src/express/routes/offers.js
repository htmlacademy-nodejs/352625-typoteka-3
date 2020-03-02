'use strict';

const {Router} = require(`express`);
const PathName = require(`./constants.js`);

const offersRouter = new Router();

const OFFER_ID = `offerId`;

offersRouter.get(
    `/add`,
    (req, res) => res.send(`/${PathName.OFFERS}/add`)
);

offersRouter.get(
    `/category/:${OFFER_ID}`,
    (req, res) => res.send(`/${PathName.OFFERS}/category/${req.params[OFFER_ID]}`)
);

offersRouter.get(
    `/edit/:${OFFER_ID}`,
    (req, res) => res.send(`/${PathName.OFFERS}/edit/${req.params[OFFER_ID]}`)
);

offersRouter.get(
    `/:${OFFER_ID}`,
    (req, res) => res.send(`/${PathName.OFFERS}/${req.params[OFFER_ID]}`)
);

module.exports = offersRouter;
