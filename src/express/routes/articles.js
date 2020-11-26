'use strict';

const {Router} = require(`express`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();

const {getLogger} = require(`./../../service/logger.js`);
const logger = getLogger();

const {
  checkApiReply,
  uploadFile,
  saveFileNameToBody,
} = require(`../middlewares`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, checkApiReply(), async (req, res) => {
  try {
    const categories = await api.getCategories();

    res.status(req.apiStatus).render(`new-ticket`, {
      categories,
      getHumanDate,
      data: req.apiData,
      errors: req.apiErrors,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/add`, uploadFile.single(`picture`), saveFileNameToBody(`picture`), async (req, res) => {
  try {
    await api.postArticle(req.body);
    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.redirect(`/articles/add?data=${JSON.stringify(error.response.data)}`);
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


articlesRouter.get(`/:articleId`, checkApiReply(), async (req, res) => {
  try {
    const [auth, article] = await Promise.all([api.getAuth(), api.getArticle(req.params.articleId)]);

    res.status(req.apiStatus).render(`ticket`, {
      auth,
      article,
      getHumanDate,
      data: req.apiData,
      errors: req.apiErrors,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.get(`/edit/:articleId`, checkApiReply(), async (req, res) => {
  try {
    const [article, categories] = await Promise.all([api.getArticle(req.params.articleId), api.getCategories()]);

    res.status(req.apiStatus).render(`ticket-edit`, {
      article,
      categories,
      data: req.apiData,
      errors: req.apiErrors,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/edit/:articleId`, uploadFile.single(`picture`), saveFileNameToBody(`picture`), async (req, res) => {
  try {
    await api.editArticle(req.body, req.params.articleId);
    res.redirect(`/articles/${req.params.articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.redirect(`/articles/edit/${req.params.articleId}?data=${JSON.stringify(error.response.data)}`);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.postComment(req.body, articleId);

    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.redirect(`/articles/${req.params.articleId}?data=${JSON.stringify(error.response.data)}`);
    logger.error(`Error occurs: ${error}`);
  }
});

module.exports = articlesRouter;
