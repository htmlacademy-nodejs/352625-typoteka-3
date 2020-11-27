'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search.js`);
const SearchService = require(`../data-service/search.js`);

const {PathName, Empty, SEARCH_PARAM} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const SEARCH = `random search string`;
const SEARCH_URI = encodeURI(SEARCH);

const searchService = new SearchService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  search(app, searchService);
  return app;
};

beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '${PathName.SEARCH}${SEARCH_PARAM}${SEARCH_URI}' to empty database`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${SEARCH_URI}`);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`request '${SEARCH_PARAM}${SEARCH_URI}' should return ${Empty.SEARCH}`, () => {
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});


describe(`When GET '${PathName.SEARCH}${SEARCH_PARAM}' to empty database`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}`);
  });

  test(`blank search returns '${Empty.SEARCH}'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});


describe(`When GET '${PathName.SEARCH}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.SEARCH}`);
  });

  test(`blank search returns '${Empty.SEARCH}'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(Empty.SEARCH);
  });
});
