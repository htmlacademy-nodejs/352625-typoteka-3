'use strict';

const {Router} = require(`express`);

const {renderCategoryPage, renderTicketPage} = require(`./render.js`);

const articlesRouter = new Router();

articlesRouter.get(
    `/add`,
    (req, res) => res.render(`new-ticket`)
);

articlesRouter.get(
    `/category/:categoryId`,
    (req, res) => renderCategoryPage(req, res)
);

articlesRouter.get(
    `/edit/:offerId`,
    (req, res) => res.render(`ticket-edit`)
);

articlesRouter.get(
    `/:offerId`,
    (req, res) => renderTicketPage(req, res)
);

module.exports = articlesRouter;
