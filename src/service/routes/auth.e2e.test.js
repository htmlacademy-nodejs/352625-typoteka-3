'use strict';

const request = require(`supertest`);

const {db} = require(`./../../../db/db.js`);
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

    const authData = await db.Auth.findAll({
      where: {
        [`is_auth`]: true
      },
      raw: true
    });

    const result = {
      status: authData.length === 0 ? false : authData[0][`is_auth`],
      userId: authData.length === 0 ? null : authData[0][`id`],
    };

    expect(res.body).toStrictEqual(result);
  });
});
