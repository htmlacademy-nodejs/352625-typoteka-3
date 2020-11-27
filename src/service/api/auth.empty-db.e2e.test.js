'use strict';

const express = require(`express`);
const request = require(`supertest`);

const auth = require(`./auth.js`);
const AuthService = require(`../data-service/auth.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const authService = new AuthService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  auth(app, authService);
  return app;
};

beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.AUTH}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.AUTH}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, () => {
    expect(response.body).toStrictEqual(Empty.AUTH);
  });
});
