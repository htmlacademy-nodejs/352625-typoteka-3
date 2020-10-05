'use strict';

const request = require(`supertest`);

const getAuth = require(`./utils/auth.js`);
const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

describe(`When GET '/${PathName.AUTH}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.AUTH}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, async () => {
    const res = await request(app).get(`/${PathName.AUTH}`);

    const data = await getAuth();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});
