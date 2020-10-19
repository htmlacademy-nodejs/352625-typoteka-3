'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const articlesRouter = new Router();

articlesRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();

    res.render(`new-ticket`, {categories, getHumanDate});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/add`, async (req, res) => {
  try {
    await api.postArticle(req.body);

    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/add`);
  }
});


articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  try {
    const [
      auth,
      activeCategory,
      categories
    ] = await Promise.all([
      api.getAuth(),
      api.getCategory(req.params.categoryId),
      api.getCategories(),
    ]);

    if (!categories) {
      render404Page(req, res);

    } else {
      res.render(`category`, {
        auth,
        activeCategory,
        categories,
        getHumanDate,
      });
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.get(`/:offerId`, async (req, res) => {
  try {
    const [auth, article] = await Promise.all([api.getAuth(), api.getArticle(req.params.offerId)]);

    res.render(`ticket`, {
      auth,
      article,
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.get(`/edit/:articleId`, async (req, res) => {
  try {
    const [article, categories] = await Promise.all([api.getArticle(req.params.articleId), api.getCategories()]);

    res.render(`ticket-edit`, {article, categories});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/edit/:articleId`, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.editArticle(req.body, articleId);

    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/edit/${req.params.articleId}`);
  }
});


articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.postComment(req.body, articleId);

    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/${req.params.articleId}`);
  }
});

module.exports = articlesRouter;
