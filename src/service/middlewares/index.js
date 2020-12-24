'use strict';

const passNotNullData = require(`./pass-not-null-data.js`);
const passProperParam = require(`./pass-proper-param.js`);
const tryToResponse = require(`./try-to-response.js`);
const isAuth = require(`./is-auth.js`);
const makeCategoriesValid = require(`./make-categories-valid.js`);
const schemaValidator = require(`./schema-validator.js`);

module.exports = {
  passNotNullData,
  passProperParam,
  tryToResponse,
  isAuth,
  makeCategoriesValid,
  schemaValidator,
};
