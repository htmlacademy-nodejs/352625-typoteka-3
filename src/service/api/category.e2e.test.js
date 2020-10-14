'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category.js`);
const CategoryService = require(`../data-service/category.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const Category = {
  RIGHT_ID: 1,
  WRONG_ID: `jskdh`,
};

const categoryService = new CategoryService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  category(app, categoryService);
  return app;
};

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    const data = await categoryService.findAll();
    response = await request(app)
      .get(`/${PathName.CATEGORIES}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories from db`, async () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/${Category.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    const data = await categoryService.findOne(Category.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to category from db`, async () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/${Category.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.CATEGORY}`, async () => {
    expect(response.body).toStrictEqual(Empty.CATEGORY);
  });
});
