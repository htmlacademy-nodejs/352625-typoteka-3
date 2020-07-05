'use strict';

const axios = require(`axios`).default;

const {
  getArticlesByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
} = require(`./utils.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const renderHomePage = async (req, res, urlArticles, urlCategories) => {
  try {
    const articles = (await axios.get(urlArticles)).data;
    const categories = (await axios.get(urlCategories)).data;
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

const renderCategoryPage = async (req, res, urlArticles, urlCategories) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const articles = (await axios.get(urlArticles)).data;
    const categories = (await axios.get(urlCategories)).data;
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
