'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {setDefaultAuthStatus, isAdmin, isUser} = require(`../middlewares`);

const myRouter = new Router();

myRouter.get(
    `/`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        res.render(`my-tickets`, {
          auth: req.session[`auth`],
          myArticles: await api.getMyArticles(req.session[`auth`][`user`][`id`]),
          getHumanDate,
        });

        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.get(
    `/comments`,
    setDefaultAuthStatus(),
    isUser(),
    async (req, res) => {
      try {
        res.render(`comments`, {
          auth: req.session[`auth`],
          myComments: await api.getAllComments(),
          getHumanDate,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.get(
    `/categories`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        res.render(`my-categories`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          data: null,
          errors: null,
          updatingCategoryId: null,
        });
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        render500Page(req, res);
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.post(
    `/comments/delete/:commentId`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        const commentId = parseInt(req.params[`commentId`], 10);
        const userId = parseInt(req.body[`userId`], 10);

        await api.deleteComment(commentId, userId);

        res.redirect(`/my/comments/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/comments/`);
      }
    }
);


myRouter.post(
    `/articles/delete/:articleId`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        const articleId = parseInt(req.params[`articleId`], 10);
        const userId = parseInt(req.body[`userId`], 10);

        await api.deleteArticle(articleId, userId);

        res.redirect(`/my/`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        logger.error(`Error occurs: ${error}`);
        res.redirect(`/my/`);
      }
    }
);


myRouter.post(
    `/categories`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        const {userId, category} = req.body;
        await api.postCategory({userId, category});

        res.redirect(`/my/categories`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`my-categories`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
          updatingCategoryId: null,
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.post(
    `/categories/edit/:categoryId`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        req.body[`categoryId`] = parseInt(req.params[`categoryId`], 10);
        const {userId, categoryId, category} = req.body;

        await api.updateCategory({userId, categoryId, category});

        res.redirect(`/my/categories`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`my-categories`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
          updatingCategoryId: parseInt(req.params[`categoryId`], 10),
        });
        logger.error(`Error occurs: ${error}`);
      }
    }
);


myRouter.post(
    `/categories/delete/:categoryId`,
    setDefaultAuthStatus(),
    isAdmin(),
    async (req, res) => {
      try {
        const categoryId = parseInt(req.params[`categoryId`], 10);
        const userId = parseInt(req.body[`userId`], 10);

        await api.deleteCategory({userId, categoryId});

        res.redirect(`/my/categories`);
        logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

      } catch (error) {
        res.status(error.response.data[`status`]).render(`my-categories`, {
          auth: req.session[`auth`],
          categories: await api.getCategories(),
          data: error.response.data[`data`],
          errors: error.response.data[`errors`],
          updatingCategoryId: parseInt(req.params[`categoryId`], 10),
        });

        logger.error(`Error occurs: ${error}`);
      }
    }
);


module.exports = myRouter;
