'use strict';

const {URL_API} = require(`./../../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`./../../service/routes/constants.js`);

const UriApi = {
  ARTICLES: `${URL_API}/${PathName.ARTICLES}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
};

const Items = {
  FRESH: 4,
  MOST_DISCUSSED: 4,
};

const getArticlesByCategory = (articles, category) => {
  return articles
    .filter((article) => article.category
      .includes(category));
};

const getFreshItems = (articles, count = Items.FRESH) => {
  const sortedData = articles.sort((a, b) => b.createdDate.machine - a.createdDate.machine);

  if (count >= articles.length) {
    return sortedData;
  } else {
    return sortedData.slice(0, count);
  }
};

const getMostDiscussedItems = (articles, count = Items.MOST_DISCUSSED) => {
  const sortedData = articles.sort((a, b) => b.comments.length - a.comments.length);

  if (count >= articles.length) {
    return sortedData;
  } else {
    return sortedData.slice(0, count);
  }
};

const getLastComments = (articles) => {
  return articles.map((item) => item.comments[0]);
};

module.exports = {
  UriApi,
  getArticlesByCategory,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
};
