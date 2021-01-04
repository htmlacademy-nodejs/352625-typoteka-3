'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {tryToResponse, schemaValidator, authenticate, alreadyRegister} = require(`../middlewares`);

const registerUserSchema = require(`../schemas/user-register.js`);
const loginUserSchema = require(`../schemas/user-login.js`);

module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/api/user`, route);

  route.post(
      `/`,
      alreadyRegister(userService),
      schemaValidator(registerUserSchema),
      async (req, res, next) => {
        const {firstname, lastname, email, password, avatar} = req.body;
        await userService.add({firstname, lastname, email, password, avatar});
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
};
