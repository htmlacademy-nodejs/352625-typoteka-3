'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {
  passNotNullData,
  passProperParam,
  tryToResponse,
  schemaValidator,
  isAdmin,
  isOwner,
  isUser,
  isCategoryIsEmpty,
} = require(`../middlewares`);

const categorySchema = require(`../schemas/category.js`);


module.exports = (app, categoryService, userService) => {
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
      `/`,
      isUser(userService),
      isAdmin(userService),
      schemaValidator(categorySchema),
      async (req, res, next) => {
        const {userId, category} = req.body;
        await categoryService.add({userId, category});
        res.body = `Category is added`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.put(
      `/`,
      isUser(userService),
      isOwner(categoryService, `categoryId`),
      schemaValidator(categorySchema),
      async (req, res, next) => {
        const {userId, categoryId, category} = req.body;
        await categoryService.update({userId, categoryId, category});
        res.body = `Category is updated`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );


  route.delete(
      `/`,
      isUser(userService),
      isOwner(categoryService, `categoryId`),
      isCategoryIsEmpty(categoryService),
      async (req, res, next) => {
        const {userId, categoryId} = req.body;
        await categoryService.delete({userId, categoryId});
        res.body = `Category is deleted`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
