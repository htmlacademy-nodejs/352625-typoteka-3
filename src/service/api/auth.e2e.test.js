'use strict';

const express = require(`express`);
const request = require(`supertest`);

const auth = require(`./auth.js`);
const AuthService = require(`../data-service/auth.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);
const {loginByAuthorId, logoutByAuthorId} = require(`./test-utils.js`);

const authService = new AuthService(fakeDb);

const Author = {
  RIGHT_ID: encodeURI(`1`),
};

const createAPI = () => {
  const app = express();
  app.use(express.json());
  auth(app, authService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.AUTH}' in login mode`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    const data = await authService.get();
    response = await request(app)
      .get(`/${PathName.AUTH}`);
    result = JSON.parse(JSON.stringify(data));
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });


  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.AUTH}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.AUTH}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should consist object with special structure`, () => {
    expect(response.body).toStrictEqual(Empty.AUTH);
  });
});
