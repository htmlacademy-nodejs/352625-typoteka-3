'use strict';

const {Router} = require(`express`);

const {
  renderCategoryPage,
  renderTicketPage,
  renderTicketEditPage,
  renderNewTicketPage,
  postFormDataToService,
  postEditedArticleToService,
  postCommentToService,
} = require(`./render.js`);

const articlesRouter = new Router();

articlesRouter.get(
    `/add`,
    (req, res) => renderNewTicketPage(req, res)
);

articlesRouter.post(
    `/add`,
    (req, res) => postFormDataToService(req, res)
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

articlesRouter.post(
    `/:articleId`,
    (req, res) => postEditedArticleToService(req, res)
);

articlesRouter.post(
    `/:articleId/comments`,
    (req, res) => postCommentToService(req, res)
);

module.exports = articlesRouter;
