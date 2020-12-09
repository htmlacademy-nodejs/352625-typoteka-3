'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  try {
    const auth = await api.getAuth();

    if (!auth.status || typeof auth.user.id !== `number`) {
      render404Page(req, res);
    } else {
      const myArticles = await api.getMyArticles(auth.user.id);

      res.render(`my-tickets`, {
        auth,
        myArticles,
        getHumanDate,
      });
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


myRouter.get(`/comments`, async (req, res) => {
  try {
    const auth = await api.getAuth();

    if (!auth.status) {
      render404Page(req, res);
    } else {
      const myComments = await api.getMyComments(auth.user.id);

      res.render(`comments`, {
        auth,
        myComments,
        getHumanDate,
      });
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


myRouter.post(`/comments/delete/:commentId`, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);

    await api.deleteComment(commentId);

    res.redirect(`/my/comments/`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
    res.redirect(`/my/comments/`);
  }
});


myRouter.post(`/articles/delete/:articleId`, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.deleteArticle(articleId);

    res.redirect(`/my/`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
    res.redirect(`/my/`);
  }
});

module.exports = myRouter;
