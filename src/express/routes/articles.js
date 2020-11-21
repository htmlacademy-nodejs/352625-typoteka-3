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
    const categories = await api.getCategories();

    res.render(`new-ticket`, {categories, getHumanDate});
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
    await api.postArticle(articleData);

    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/add`);
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
