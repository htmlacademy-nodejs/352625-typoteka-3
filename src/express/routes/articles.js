'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const nanoid = require(`nanoid`);

const {getHumanDate, getPageNumbers} = require(`./../utils.js`);
const {render404Page, render500Page} = require(`./render.js`);
const api = require(`../api.js`).getApi();
const {getLogger} = require(`./../../service/logger.js`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger();

const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/add`, async (req, res) => {
  try {
    let status = 200;
    let data;
    let errors;

    if (req.query.data) {
      const apiReply = JSON.parse(req.query.data);
      status = apiReply.status;
      data = apiReply.data;
      errors = apiReply.errors;
    }

    const categories = await api.getCategories();

    res.status(status).render(`new-ticket`, {categories, getHumanDate, data, errors});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = body;
  if (file) {
    articleData[`picture`] = file.filename;
  }

  try {
    res.body = await api.postArticle(articleData);
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


articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    let status = 200;
    let data;
    let errors;

    if (req.query.data) {
      const apiReply = JSON.parse(req.query.data);
      status = apiReply.status;
      data = apiReply.data;
      errors = apiReply.errors;
    }

    const [auth, article] = await Promise.all([api.getAuth(), api.getArticle(req.params.articleId)]);

    res.status(status).render(`ticket`, {
      auth,
      article,
      getHumanDate,
      data,
      errors,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.get(`/edit/:articleId`, async (req, res) => {
  try {
    let status = 200;
    let data;
    let errors;

    if (req.query.data) {
      const apiReply = JSON.parse(req.query.data);
      status = apiReply.status;
      data = apiReply.data;
      errors = apiReply.errors;
    }

    const [article, categories] = await Promise.all([api.getArticle(req.params.articleId), api.getCategories()]);
    res.status(status).render(`ticket-edit`, {article, categories, data, errors});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
});


articlesRouter.post(`/edit/:articleId`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = body;
  if (file) {
    articleData[`picture`] = file.filename;
  }

  try {
    const articleId = parseInt(req.params.articleId, 10);

    await api.editArticle(articleData, articleId);

    res.redirect(`/articles/${articleId}`);
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
