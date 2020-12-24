'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {
  isAuth,
  passNotNullData,
  passProperParam,
  tryToResponse,
  schemaValidator,
} = require(`../middlewares`);

const categorySchema = require(`../schemas/category.js`);


module.exports = (app, categoryService, authService) => {
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

  route.post(
      `/add`,
      isAuth(authService.get.bind(authService)),
      schemaValidator(categorySchema),
      async (req, res, next) => {
        await categoryService.add(req.body);
        res.body = `Category is added`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/:categoryId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`categoryId`, `Incorrect id`),
      schemaValidator(categorySchema),
      async (req, res, next) => {
        await categoryService.update(req.body, req.params[`categoryId`]);
        res.body = `Category is updated`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/:categoryId`,
      isAuth(authService.get.bind(authService)),
      passProperParam(`categoryId`, `Incorrect id`),
      async (req, res, next) => {
        await categoryService.delete(req.params[`categoryId`]);
        res.body = `Category is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
