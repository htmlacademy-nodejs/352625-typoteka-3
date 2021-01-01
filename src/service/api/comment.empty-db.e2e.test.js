'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const {CommentService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const User = {
  ID: 1,
};

const Comment = {
  ID: 1,
};

const commentService = new CommentService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comment(app, commentService);
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


describe(`When GET '/${PathName.COMMENTS}/byAuthor/${User.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byAuthor/${User.ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    commentId: Comment.ID,
    userId: User.ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Действие не авторизовано`
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
