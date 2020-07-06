'use strict';

const {Router} = require(`express`);

const {renderCategoryPage, renderTicketPage} = require(`./render.js`);

const offersRouter = new Router();

offersRouter.get(
    `/add`,
    (req, res) => res.render(`new-ticket`)
);

offersRouter.get(
    `/category/:categoryId`,
    (req, res) => renderCategoryPage(req, res)
);

offersRouter.get(
    `/edit/:offerId`,
    (req, res) => res.render(`ticket-edit`)
);

offersRouter.get(
    `/:offerId`,
    (req, res) => renderTicketPage(req, res)
);

module.exports = offersRouter;
