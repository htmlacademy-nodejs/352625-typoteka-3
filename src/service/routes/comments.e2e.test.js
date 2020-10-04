'use strict';

const request = require(`supertest`);

const getComments = require(`./utils/comments.js`);
const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

describe(`When GET '/${PathName.COMMENTS}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}`);

    const data = await getComments();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});
