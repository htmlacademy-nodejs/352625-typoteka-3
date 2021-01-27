'use strict';

const passNotNullData = require(`./pass-not-null-data.js`);
const passProperParam = require(`./pass-proper-param.js`);
const tryToResponse = require(`./try-to-response.js`);
const authenticate = require(`./authenticate.js`);
const isArticle = require(`./is-article.js`);
const isComment = require(`./is-comment.js`);
const isAdmin = require(`./is-admin.js`);
const isOwner = require(`./is-owner.js`);
const isUser = require(`./is-user.js`);
const isCategoryIsEmpty = require(`./is-category-is-empty.js`);
const alreadyRegister = require(`./already-register.js`);
const makeCategoriesValid = require(`./make-categories-valid.js`);
const schemaValidator = require(`./schema-validator.js`);

module.exports = {
  passNotNullData,
  passProperParam,
  tryToResponse,
  authenticate,
  isArticle,
  isComment,
  isAdmin,
  isOwner,
  isUser,
  isCategoryIsEmpty,
  alreadyRegister,
  makeCategoriesValid,
  schemaValidator,
};
