'use strict';

const {
  getArticlesByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
  getItemByCommentId,
  getCommentsByUserId,
} = require(`./../utils.js`);

const {
  getArticles,
  getArticle,
  postArticle,
  getCategories,
  getAuth,
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
    const auth = await getAuth();
    const articles = await getArticles();
    const categories = await getCategories();
    const mostDiscussedItems = getMostDiscussedItems(articles);
    const lastComments = getLastComments(mostDiscussedItems);

    res.render(`main`, {
      auth,
      articles,
      categories,
      getArticlesByCategory,
      mostDiscussedItems,
      lastComments,
      freshItems: getFreshItems(articles),
      getItemByCommentId,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const activeCategoryId = req.params.categoryId;
    const articles = await getArticles();
    const categories = await getCategories();

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
    const auth = await getAuth();
    const article = await getArticle(req.params.offerId);
    const articles = await getArticles();

    res.render(`ticket`, {
      auth,
      article,
      articles,
      getArticlesByCategory,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketEditPage = async (req, res) => {
  try {
    const article = await getArticle(req.params.articleId);
    const categories = await getCategories();
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
    const auth = await getAuth();
    const articles = await getArticles();

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
  postFormDataToService,
};
