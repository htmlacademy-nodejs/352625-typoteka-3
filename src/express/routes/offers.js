'use strict';

const {Router} = require(`express`);

const offersRouter = new Router();

const OFFER_ID = `offerId`;

offersRouter.get(
    `/add`,
    (req, res) => res.render(`new-ticket`)
);

offersRouter.get(
    `/category/:${OFFER_ID}`,
    (req, res) => res.render(`category`)
);

offersRouter.get(
    `/edit/:${OFFER_ID}`,
    (req, res) => res.render(`ticket-edit`)
);

offersRouter.get(
    `/:${OFFER_ID}`,
    (req, res) => res.render(`ticket`)
);

module.exports = offersRouter;
