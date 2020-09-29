'use strict';

const request = require(`supertest`);

const {sequelize, db} = require(`./../../../db/db.js`);
const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories from db`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);

    const categories = await db.Category.findAll({raw: true});
    await sequelize.close();

    expect(res.body).toStrictEqual(categories);
  });
});
