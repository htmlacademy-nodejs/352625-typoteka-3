'use strict';

const express = require(`express`);
const request = require(`supertest`);

const auth = require(`./auth.js`);
const AuthService = require(`../data-service/auth.js`);

const {PathName} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const authService = new AuthService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  auth(app, authService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When GET '/${PathName.AUTH}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await authService.get();
    response = await request(app)
      .get(`/${PathName.AUTH}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, () => {
    expect(response.body).toStrictEqual(result);
  });
});
