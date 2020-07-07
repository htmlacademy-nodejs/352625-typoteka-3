'use strict';

const {
  getArticlesByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
  getItemIdByCommentId,
} = require(`./../utils.js`);

const {getArticles, getArticle, getCategories} = require(`./../axios.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const render404Page = (req, res) => {
  res.status(404).render(`errors/404`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

const render500Page = (req, res) => {
  res.status(500).render(`errors/500`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

const renderHomePage = async (req, res) => {
  try {
    const articles = await getArticles();
    const categories = await getCategories();
    const mostDiscussedItems = getMostDiscussedItems(articles);
    const lastComments = getLastComments(mostDiscussedItems);

    res.render(`main`, {
      articles,
      categories,
      getArticlesByCategory,
      mostDiscussedItems,
      lastComments,
      freshItems: getFreshItems(articles),
      getItemIdByCommentId,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const articles = await getArticles();
    const categories = await getCategories();

    if (!categories.find((item) => item.id === activeCategoryId)) {
      render404Page(req, res);

    } else {
      res.render(`category`, {
        articles,
        categories,
        activeCategoryId,
        getArticlesByCategory,
        getCategoryById,
      });
      logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketPage = async (req, res) => {
  try {
    const article = await getArticle(req.params.offerId);
    const articles = await getArticles();

    res.render(`ticket`, {
      article,
      articles,
      getArticlesByCategory,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

module.exports = {
  render404Page,
  render500Page,
  renderHomePage,
  renderCategoryPage,
  renderTicketPage,
};
