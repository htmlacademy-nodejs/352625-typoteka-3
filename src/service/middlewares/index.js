'use strict';

const passNotNullData = require(`./pass-not-null-data.js`);
const passProperParam = require(`./pass-proper-param.js`);
const tryToResponse = require(`./try-to-response.js`);
const isAuth = require(`./is-auth.js`);
const validateArticle = require(`./validate-article.js`);
const validateComment = require(`./validate-comment.js`);

module.exports = {
  passNotNullData,
  passProperParam,
  tryToResponse,
  isAuth,
  validateArticle,
  validateComment,
};
