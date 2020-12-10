'use strict';

const {Router} = require(`express`);

const {getHumanDate} = require(`./../utils.js`);
const {render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const {isAuth, isAdmin} = require(`../middlewares`);

const myRouter = new Router();

myRouter.get(`/`, isAuth(api.getAuth.bind(api)), isAdmin(), async (req, res) => {
  try {
    const myArticles = await api.getMyArticles(res.auth.user.id);

    res.render(`my-tickets`, {
      auth: res.auth,
      myArticles,
      getHumanDate,
    });

    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


myRouter.get(`/comments`, isAuth(api.getAuth.bind(api)), async (req, res) => {
  try {
    const myComments = await api.getMyComments(res.auth.user.id);

    res.render(`comments`, {
      auth: res.auth,
      myComments,
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


myRouter.post(`/comments/delete/:commentId`, isAuth(api.getAuth.bind(api)), async (req, res) => {
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


myRouter.post(`/articles/delete/:articleId`, isAuth(api.getAuth.bind(api)), isAdmin(), async (req, res) => {
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
