'use strict';

const {
  getArticlesByCategory,
  getCategoryById,
  getItemByCommentId,
  getCommentsByUserId,
} = require(`./../utils.js`);

const {
  getArticles,
  getArticle,
  postArticle,
  getSearch,
  getCategories,
  getAuth,
  getMostDiscussed,
  getFreshItems,
  getComments,
} = require(`./../axios.js`);

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
    const [
      auth,
      categories,
      mostDiscussedItems,
      freshItems,
      lastComments,
    ] = await Promise.all([
      getAuth(),
      getCategories(),
      getMostDiscussed(),
      getFreshItems(),
      getComments(),
    ]);

    res.render(`main`, {
      auth,
      categories,
      mostDiscussedItems,
      lastComments,
      freshItems,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const [auth, articles, categories] = await Promise.all([getAuth(), getArticles(), getCategories()]);
    const activeCategoryId = req.params.categoryId;

    if (!categories.find((item) => item.id === activeCategoryId)) {
      render404Page(req, res);

    } else {
      res.render(`category`, {
        auth,
        articles,
        categories,
        activeCategoryId,
        getArticlesByCategory,
        getCategoryById,
      });
      logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketPage = async (req, res) => {
  try {
    const [auth, article] = await Promise.all([getAuth(), getArticle(req.params.offerId)]);

    res.render(`ticket`, {
      auth,
      article
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketEditPage = async (req, res) => {
  try {
    const [article, categories] = await Promise.all([getArticle(req.params.articleId), getCategories()]);

    res.render(`ticket-edit`, {article, categories});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderNewTicketPage = async (req, res) => {
  try {
    const categories = await getCategories();

    res.render(`new-ticket`, {categories});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderMyTicketsPage = async (req, res) => {
  try {
    const auth = await getAuth();

    res.render(`my-tickets`, {auth});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCommentsPage = async (req, res) => {
  try {
    const [auth, articles] = await Promise.all([getAuth(), getArticles()]);

    res.render(`comments`, {
      auth,
      articles,
      getCommentsByUserId,
      getItemByCommentId,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderSearchPage = async (req, res) => {
  try {
    const auth = await getAuth();

    const searchRequest = req.query.search;
    let result = null;

    if (searchRequest !== undefined) {
      result = await getSearch(req.query.search);
    }

    res.render(`search`, {
      auth,
      result,
      searchRequest,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};


const postFormDataToService = (req, res) => {
  try {
    console.log(req.body);
    postArticle(req.body);

    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/add`);
  }
};

module.exports = {
  render404Page,
  render500Page,
  renderHomePage,
  renderCategoryPage,
  renderTicketPage,
  renderTicketEditPage,
  renderNewTicketPage,
  renderMyTicketsPage,
  renderCommentsPage,
  renderSearchPage,
  postFormDataToService,
};
