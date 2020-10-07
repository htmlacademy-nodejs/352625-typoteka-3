'use strict';

const {
  getMyArticles,
  getArticle,
  postArticle,
  editArticle,
  getSearch,
  getCategories,
  getCategory,
  getAuth,
  getMostDiscussed,
  getFreshItems,
  getFreshComments,
  getMyComments,
  postComment,
} = require(`./../axios.js`);

const {getHumanDate} = require(`./../utils.js`);

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
      getFreshComments(),
    ]);

    res.render(`main`, {
      auth,
      categories,
      mostDiscussedItems,
      lastComments,
      freshItems,
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const [
      auth,
      activeCategory,
      categories
    ] = await Promise.all([
      getAuth(),
      getCategory(req.params.categoryId),
      getCategories()
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
};

const renderTicketPage = async (req, res) => {
  try {
    const [auth, article] = await Promise.all([getAuth(), getArticle(req.params.offerId)]);

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

    res.render(`new-ticket`, {categories, getHumanDate});
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderMyTicketsPage = async (req, res) => {
  try {
    const auth = await getAuth();

    if (!auth.status || typeof auth.user.id !== `number`) {
      render404Page(req, res);
    } else {
      const myArticles = await getMyArticles(auth.user.id);

      res.render(`my-tickets`, {
        myArticles,
        getHumanDate,
      });
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    render500Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCommentsPage = async (req, res) => {
  try {
    const auth = await getAuth();

    if (!auth.status) {
      render404Page(req, res);
    } else {
      const myComments = await getMyComments(auth.user.id);

      res.render(`comments`, {
        myComments,
        getHumanDate,
      });
    }

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
      getHumanDate,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const postFormDataToService = (req, res) => {
  try {
    postArticle(req.body);

    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/add`);
  }
};

const postEditedArticleToService = (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    editArticle(req.body, articleId);

    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/edit/${req.params.articleId}`);
  }
};

const postCommentToService = (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);

    postComment(req.body, articleId);

    // TODO редирект не обновляет обращение к базе данных - чтобы увидеть новый коммент приходится обновлять страницу вручную
    res.redirect(`/articles/${articleId}`);
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/articles/${req.params.articleId}`);

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
  postEditedArticleToService,
  postCommentToService,
};
