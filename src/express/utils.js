'use strict';

const {URL_API} = require(`./../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`./../service/routes/constants.js`);

const UriApi = {
  ARTICLES: `${URL_API}/${PathName.ARTICLES}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
  AUTH: `${URL_API}/${PathName.AUTH}`,
  SEARCH: `${URL_API}/${PathName.SEARCH}/${SEARCH_PARAM}`,
};

const Items = {
  FRESH: 4,
  MOST_DISCUSSED: 4,
};

const Comments = {
  FRESH: 4,
};

const getArticlesByCategory = (articles, category) => {
  return articles
    .filter((article) => article.category
      .map((item) => item.id)
      .includes(category.id));
};

const getCategoryById = (categories, id) => {
  return categories.find((category) => category.id === id);
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

const getLastComments = (articles, count = Comments.FRESH) => {
  const sortedComments = articles.map((item) => item.comments)
    .flat()
    .sort((a, b) => b.createdDate.machine - a.createdDate.machine);

  if (count >= sortedComments.length) {
    return sortedComments;
  } else {
    return sortedComments.slice(0, count);
  }
};

const getItemByCommentId = (articles, commentId) => {
  return articles.find((item) => item.comments
    .find((comment) => comment.id === commentId));
};


const getCommentsByUserId = (articles, userId) => {
  return articles
    .map((item) => item.comments)
    .flat()
    .filter((comment) => comment.author.id === userId);
};

module.exports = {
  UriApi,
  getArticlesByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
  getLastComments,
  getItemByCommentId,
  getCommentsByUserId,
};
