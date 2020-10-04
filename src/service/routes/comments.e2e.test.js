'use strict';

const request = require(`supertest`);

const {getFreshComments, getCommentsByUserId} = require(`./utils/comments.js`);
const {app} = require(`./../cli/server.js`);
const {PathName} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

const User = {
  RIGHT_ID: 1,
  WRONG_ID: 1234567809
};

describe(`When GET '/${PathName.COMMENTS}/fresh'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/fresh`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/fresh`);

    const data = await getFreshComments();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.COMMENTS}/byUser/${User.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/byUser/${User.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/byUser/${User.RIGHT_ID}`);

    const data = await getCommentsByUserId(User.RIGHT_ID);

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.COMMENTS}/byUser/${User.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/byUser/${User.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to empty array`, async () => {
    const res = await request(app).get(`/${PathName.COMMENTS}/byUser/${User.WRONG_ID}`);

    const data = [];

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});
