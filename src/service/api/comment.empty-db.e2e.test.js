'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const {CommentService, AuthService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const Author = {
  ID: `randomId`,
};

const Comment = {
  ID: `randomId`,
};

const commentService = new CommentService(fakeDb);
const authService = new AuthService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comment(app, commentService, authService);
  return app;
};

beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});


afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.COMMENTS}/fresh' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.COMMENTS}/fresh`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byAuthor/${Author.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byAuthor/${Author.ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response is 'Unauthorized access'`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toBe(`Unauthorized access`);
  });
});
