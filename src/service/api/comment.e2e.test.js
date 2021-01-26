'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment.js`);
const {CommentService} = require(`../data-service`);

const {PathName} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const User = {
  AUTHOR_ID: 1,
  NOT_AUTHOR_ID: 2,
  NON_EXIST_ID: 1000,
};

const Comment = {
  RIGHT_ID: 1,
  WRONG_ID: 10000,
};

const commentService = new CommentService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comment(app, commentService);
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


describe(`When GET '/${PathName.COMMENTS}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await commentService.findAll();
    response = await request(app)
      .get(`/${PathName.COMMENTS}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to all comments from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment exists but User not exists`, () => {
  const app = createAPI();

  let response;
  let commentBeforeAction;
  let commentAfterAction;

  const data = {
    commentId: Comment.RIGHT_ID,
    userId: User.NON_EXIST_ID,
  };

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    commentBeforeAction = await commentService.findOne(Comment.RIGHT_ID);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
    commentAfterAction = await commentService.findOne(Comment.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response is 'Unauthorized access'`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Comment with id ${Comment.RIGHT_ID} is not deleted`, () => {
    expect(commentBeforeAction).toStrictEqual(commentAfterAction);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment and User exists but User isn't an Author of Comment`, () => {
  const app = createAPI();

  let response;
  let commentBeforeAction;
  let commentAfterAction;

  const data = {
    commentId: Comment.RIGHT_ID,
    userId: User.NOT_AUTHOR_ID,
  };

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    commentBeforeAction = await commentService.findOne(Comment.RIGHT_ID);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
    commentAfterAction = await commentService.findOne(Comment.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response should be an object with special structure`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Comment with id ${Comment.RIGHT_ID} is not deleted`, () => {
    expect(commentBeforeAction).toStrictEqual(commentAfterAction);
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment and User exists and User is an Author`, () => {
  const app = createAPI();

  let response;
  let commentAfterAction;

  const data = {
    commentId: Comment.RIGHT_ID,
    userId: User.AUTHOR_ID,
  };

  const expectedReply = `Comment is deleted`;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);

    commentAfterAction = await commentService.findOne(Comment.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.OK} and response is ${expectedReply}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toBe(expectedReply);
  });

  test(`Comment with id ${Comment.RIGHT_ID} is deleted`, () => {
    expect(commentAfterAction).toBeNull();
  });
});


describe(`When DELETE '/${PathName.COMMENTS}' in case: Comment doesn't exist but User exists`, () => {
  const app = createAPI();

  let response;
  let item;

  const data = {
    commentId: Comment.WRONG_ID,
    userId: User.AUTHOR_ID,
  };

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED,
  };


  beforeAll(async () => {
    item = await commentService.findOne(Comment.WRONG_ID);
    response = await request(app)
      .delete(`/${PathName.COMMENTS}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response should be an object with special structure`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Comment with id ${Comment.WRONG_ID} is not exist`, () => {
    expect(item).toBeNull();
  });

});
