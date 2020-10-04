'use strict';

const {URL_API} = require(`./../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`./../service/routes/constants.js`);

const UriApi = {
  ARTICLES: `${URL_API}/${PathName.ARTICLES}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
  AUTH: `${URL_API}/${PathName.AUTH}`,
  SEARCH: `${URL_API}/${PathName.SEARCH}/${SEARCH_PARAM}`,
  COMMENTS: `${URL_API}/${PathName.COMMENTS}`,
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
  getItemByCommentId,
  getCommentsByUserId,
};
