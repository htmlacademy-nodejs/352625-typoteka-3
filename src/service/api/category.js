'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {passNotNullData, passProperParam, tryToResponse} = require(`../middlewares`);


module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/api/categories`, route);

  route.get(
      `/`,
      passNotNullData(categoryService.findAll.bind(categoryService), Empty.CATEGORIES),
      tryToResponse(HttpCode.OK)
  );


  route.get(
      `/id=:id&page=:pageNumber`,
      passProperParam(`id`, Empty.CATEGORY),
      passProperParam(`pageNumber`, Empty.CATEGORY),
      passNotNullData(categoryService.findOne.bind(categoryService), Empty.CATEGORY, `id`, `pageNumber`),
      tryToResponse(HttpCode.OK)
  );
};
