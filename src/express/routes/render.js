'use strict';

const {
  getArticlesByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
} = require(`./../utils.js`);

const {getArticles, getCategories} = require(`./../axios.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

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
    });

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const articles = await getArticles();
    const categories = await getCategories();

    res.render(`category`, {
      articles,
      categories,
      activeCategoryId,
      getArticlesByCategory,
      getCategoryById,
    });

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

module.exports = {
  renderHomePage,
  renderCategoryPage
};
