'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category.js`);
const {CategoryService, AuthService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const Category = {
  ID: `randomId`,
};

const Page = {
  ID: `randomPage`,
};

const categoryService = new CategoryService(fakeDb, fakeSequelize);
const authService = new AuthService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  category(app, categoryService, authService);
  return app;
};


beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});


afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.CATEGORIES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.CATEGORIES}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORIES);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/id=${Category.ID}&page=${Page.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/id=${Category.ID}&page=${Page.ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to to ${Empty.CATEGORY}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORY);
  });
});
