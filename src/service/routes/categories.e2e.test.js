'use strict';

const request = require(`supertest`);

const getCategories = require(`./utils/categories.js`);
const getCategory = require(`./utils/category.js`);

const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

const Category = {
  RIGHT_ID: 2,
  WRONG_ID: `36532`,
};

describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories from db`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);

    const data = await getCategories();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.CATEGORIES}/${Category.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to category from db`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`);

    const data = await getCategory(Category.RIGHT_ID);

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.CATEGORIES}/${Category.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
