'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const {CommentService, AuthService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);
const {loginByAuthorId, logoutByAuthorId} = require(`./test-utils.js`);

const User = {
  RIGHT_ID: 1,
  WRONG_ID: `sdmf`
};

const Comment = {
  RIGHT_ID: 1,
  WRONG_ID: `lksdn`,
  NON_EXIST_ID: 10000,
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
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When GET '/${PathName.COMMENTS}/fresh'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findFresh();
    response = await request(app)
      .get(`/${PathName.COMMENTS}/fresh`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byAuthor/${User.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findAllByAuthor(User.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byAuthor/${User.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.COMMENTS}/byAuthor/${User.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.COMMENTS}/byAuthor/${User.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.COMMENTS}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENTS);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.RIGHT_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;
  let commentBeforeAction;
  let commentAfterAction;

  beforeAll(async () => {
    commentBeforeAction = await commentService.findOne(Comment.RIGHT_ID);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.RIGHT_ID}`);
    commentAfterAction = await commentService.findOne(Comment.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response is 'Unauthorized access'`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toBe(`Unauthorized access`);
  });

  test(`Comment with id ${Comment.RIGHT_ID} is not deleted`, () => {
    expect(commentBeforeAction).toStrictEqual(commentAfterAction);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;
  let commentAfterAction;

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);

    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.RIGHT_ID}`);

    commentAfterAction = await commentService.findOne(Comment.RIGHT_ID);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.OK} and response is 'Comment is deleted'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toBe(`Comment is deleted`);
  });

  test(`Comment with id ${Comment.RIGHT_ID} is deleted`, () => {
    expect(commentAfterAction).toBeNull();
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.WRONG_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response is 'Incorrect id'`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toBe(`Incorrect id`);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response is 'Unauthorized access'`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.NON_EXIST_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.NON_EXIST_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response is 'Comment doesn't exist'`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toBe(`Comment doesn't exist`);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}/${Comment.NON_EXIST_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}/${Comment.NON_EXIST_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response is 'Unauthorized access'`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toBe(`Unauthorized access`);
  });
});
