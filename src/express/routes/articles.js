'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();

const {getLogger} = require(`./../../service/logger.js`);
const logger = getLogger();

const {
  uploadFile,
  saveFileNameToBody,
  isAuth,
  isAdmin,
} = require(`../middlewares`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, isAuth(api.getAuth.bind(api)), isAdmin(), async (req, res) => {
  try {
    res.render(`new-ticket`, {
      auth: res.auth,
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
});


articlesRouter.post(`/add`, isAuth(api.getAuth.bind(api)), isAdmin(), uploadFile.single(`picture`), saveFileNameToBody(`picture`), async (req, res) => {
  try {
    await api.postArticle(req.body);
    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(error.response.data[`status`]).render(`new-ticket`, {
      auth: res.auth,
      categories: await api.getCategories(),
      getHumanDate,
      data: error.response.data[`data`],
      errors: error.response.data[`errors`],
    });
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.get(`/category/id=:categoryId&page=:pageNumber`, async (req, res) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const pageNumber = req.params.pageNumber;

    const [
      auth,
      {activeCategory, articles},
      categories
    ] = await Promise.all([
      api.getAuth(),
      api.getCategory(activeCategoryId, pageNumber),
      api.getCategories(),
    ]);

    if (!categories) {
      render404Page(req, res);

    } else {
      res.render(`category`, {
        auth,
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
});


articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  res.redirect(`/articles/category/id=${req.params.categoryId}&page=1`);
});


articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    res.render(`ticket`, {
      auth: await api.getAuth(),
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
});


articlesRouter.get(`/edit/:articleId`, isAuth(api.getAuth.bind(api)), isAdmin(), async (req, res) => {
  try {
    res.render(`ticket-edit`, {
      auth: res.auth,
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
});


articlesRouter.post(`/edit/:articleId`, isAuth(api.getAuth.bind(api)), isAdmin(), uploadFile.single(`picture`), saveFileNameToBody(`picture`), async (req, res) => {
  try {
    await api.editArticle(req.body, req.params[`articleId`]);
    res.redirect(`/articles/${req.params[`articleId`]}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(error.response.data[`status`]).render(`ticket-edit`, {
      auth: res.auth,
      article: await api.getArticle(req.params.articleId),
      categories: await api.getCategories(),
      getHumanDate,
      data: error.response.data[`data`],
      errors: error.response.data[`errors`],
    });
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/:articleId/comments`, isAuth(api.getAuth.bind(api)), async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.postComment(req.body, articleId);

    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(error.response.data[`status`]).render(`ticket`, {
      auth: await api.getAuth(),
      article: await api.getArticle(req.params[`articleId`]),
      getHumanDate,
      data: error.response.data[`data`],
      errors: error.response.data[`errors`],
    });
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = articlesRouter;
