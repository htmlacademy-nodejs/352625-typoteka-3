'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const CommentService = require(`../data-service/comment.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const User = {
  RIGHT_ID: 1,
  WRONG_ID: `sdmf`
};

const Comment = {
  RIGHT_ID: 1,
  WRONG_ID: `lksdn`
};

const commentService = new CommentService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comment(app, commentService);
  return app;
};

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When GET '/${PathName.COMMENTS}/fresh'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    const data = await commentService.findFresh();
    response = await request(app)
      .get(`/${PathName.COMMENTS}/fresh`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, async () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byUserId/${User.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    const data = await commentService.findAllByUserId(User.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byUserId/${User.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, async () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byUserId/${User.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byUserId/${User.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, async () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When POST '/${PathName.COMMENTS}/delete/${Comment.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    response = await request(app)
      .post(`/${PathName.COMMENTS}/delete/${Comment.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.OK} and response.text is 'Comment is deleted'`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.text).toBe(`Comment is deleted`);
  });
});


describe(`When POST '/${PathName.COMMENTS}/delete/${Comment.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await initDb(mocks, fakeSequelize);
    response = await request(app)
      .post(`/${PathName.COMMENTS}/delete/${Comment.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response.text is 'Comment doesn't exist'`, async () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.text).toBe(`Comment doesn't exist`);
  });
});
