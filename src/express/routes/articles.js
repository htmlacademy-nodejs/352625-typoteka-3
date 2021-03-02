'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {io, EventNames} = require(`../server.js`);

const {getLogger} = require(`./../../service/logger.js`);
const logger = getLogger();

const {
  uploadFile,
  saveFileNameToBody,
  isAdmin,
  isUser,
  setDefaultAuthStatus,
} = require(`../middlewares`);

const articlesRouter = new Router();

articlesRouter.get(
    `/add`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        res.render(`new-ticket`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          getHumanDate,
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.post(
    `/add`,
    setDefaultAuthStatus(),
    uploadFile.single(`picture`),
    saveFileNameToBody(`picture`),
    isAdmin(),
    async (req, res) => {
      try {
        const {createdDate, title, categories, announce, fullText, picture, pictureFilename, userId} = req.body;
        await api.postArticle({createdDate, title, categories, announce, fullText, picture, pictureFilename, userId});
        res.redirect(`/my`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`new-ticket`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          getHumanDate,
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.get(
    `/category/id=:categoryId&page=:pageNumber`,
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        const activeCategoryId = req.params.categoryId;
        const pageNumber = req.params.pageNumber;

        const [
          {activeCategory, articles},
          categories
        ] = await Promise.all([
          api.getCategory(activeCategoryId, pageNumber),
          api.getCategories(),
        ]);

        if (!categories) {
          render404Page(req, res);

        } else {
          res.render(`category`, {
            auth: req.session[`auth`],
            activeCategory,
            articles,
            categories,
            getHumanDate,
            pageNumbers: getPageNumbers(articles.totalPages),
          });
          logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
        }

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.get(
    `/category/:categoryId`,
    async (req, res) => {
      res.redirect(`/articles/category/id=${req.params.categoryId}&page=1`);
    }
);


articlesRouter.get(
    `/:articleId`,
    setDefaultAuthStatus(),
    async (req, res) => {
      try {
        res.render(`ticket`, {
          auth: req.session[`auth`],
          article: await api.getArticle(req.params[`articleId`]),
          getHumanDate,
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.get(
    `/edit/:articleId`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        res.render(`ticket-edit`, {
          auth: req.session[`auth`],
          article: await api.getArticle(req.params.articleId),
          categories: await api.getCategories(),
          getHumanDate,
          data: null,
          errors: null,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render404Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.post(
    `/edit/:articleId`,
    setDefaultAuthStatus(),
    uploadFile.single(`picture`),
    saveFileNameToBody(`picture`),
    isAdmin(),
    async (req, res) => {
      try {
        req.body[`articleId`] = parseInt(req.params[`articleId`], 10);
        const {createdDate, title, categories, announce, fullText, picture, pictureFilename, userId, articleId} = req.body;

        await api.editArticle({createdDate, title, categories, announce, fullText, picture, pictureFilename, userId, articleId});

        res.redirect(`/articles/${req.params[`articleId`]}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket-edit`, {
          auth: req.session[`auth`],
          article: await api.getArticle(req.params.articleId),
          categories: await api.getCategories(),
          getHumanDate,
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);


articlesRouter.post(
    `/:articleId/comments`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        req.body[`articleId`] = parseInt(req.params[`articleId`], 10);
        const {userId, articleId, text} = req.body;

        await api.postComment({userId, articleId, text});

        const [freshComments, hotArticles] = await Promise.all([api.getFreshComments(), api.getMostDiscussed()]);
        io.emit(EventNames.COMMENT_ADD, JSON.stringify({freshComments, hotArticles}));

        res.redirect(`/articles/${articleId}`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`ticket`, {
          auth: req.session[`auth`],
          article: await api.getArticle(req.params[`articleId`]),
          getHumanDate,
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);

module.exports = articlesRouter;
