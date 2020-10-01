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

    const authData = await db.Auth.findOne({
      where: {
        [`is_auth`]: true
      },
      include: [`user`],
    });

    let data;

    if (!authData) {

      data = {
        status: false,
        user: null,
        avatar: null,
      };

    } else {
      const userAvatar = await db.Avatar.findOne({
        where: {
          [`id`]: authData.user[`avatar_id`]
        }
      });

      data = {
        status: authData[`is_auth`],
        user: authData[`user`],
        avatar: userAvatar,
      };
    }
    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});
