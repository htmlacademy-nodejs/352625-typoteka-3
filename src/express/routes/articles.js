'use strict';

const {Router} = require(`express`);

const {renderCategoryPage, renderTicketPage, renderTicketEditPage} = require(`./render.js`);

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
    `/edit/:articleId`,
    (req, res) => renderTicketEditPage(req, res)
);

articlesRouter.get(
    `/:offerId`,
    (req, res) => renderTicketPage(req, res)
);

module.exports = articlesRouter;
