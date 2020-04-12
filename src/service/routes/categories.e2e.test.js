'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty} = require(`./../routes/constants.js`);
const {FILE_NAME, HttpCode} = require(`./../cli/constants.js`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const readFile = promisify(fs.readFile);

describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories of mock offers from '${FILE_NAME}'`, async () => {
    const res = await request(app).get(`/${PathName.CATEGORIES}`);
    const mockOffers = JSON.parse(await readFile(FILE_NAME));
    const categories = Array
      .from(new Set(mockOffers.map((elem) => elem.category[0] || Empty.DATA)));

    expect(res.body).toStrictEqual(categories);
  });
});
