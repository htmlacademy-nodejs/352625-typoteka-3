'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {tryToResponse, schemaValidator, authenticate} = require(`../middlewares`);

const registerUserSchema = require(`../schemas/user-register.js`);
const loginUserSchema = require(`../schemas/user-login.js`);

module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/api/user`, route);

  route.post(
      `/`,
      schemaValidator(registerUserSchema, userService.getExistingEmail.bind(userService)),
      async (req, res, next) => {
        await userService.add(req.body);
        res.body = `User is registered`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );

  route.post(
      `/login`,
      schemaValidator(loginUserSchema),
      authenticate(userService),
      tryToResponse(HttpCode.OK)
  );

  route.post(
      `/logout`,
      async (req, res, next) => {
        await userService.logout();
        res.body = `User is logged out`;
        next();
      },
      tryToResponse(HttpCode.OK)
  );
};
