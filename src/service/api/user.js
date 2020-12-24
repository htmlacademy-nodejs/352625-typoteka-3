'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`./../cli/constants.js`);
const {tryToResponse, schemaValidator} = require(`../middlewares`);

const userSchema = require(`../schemas/user.js`);


module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/api/user`, route);

  route.post(
      `/`,
      schemaValidator(userSchema, userService.getExistingEmail.bind(userService)),
      async (req, res, next) => {
        await userService.add(req.body);
        res.body = `User is registered`;
        next();
      },
      tryToResponse(HttpCode.CREATED)
  );
};
