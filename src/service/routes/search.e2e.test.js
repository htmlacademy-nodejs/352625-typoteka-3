'use strict';

const request = require(`supertest`);

const {db} = require(`./../../data/db/db.js`);
const {app} = require(`./../cli/server.js`);
const {PathName, Empty, SEARCH_PARAM} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

const RIGHT_SEARCH = `лучший`;
const RIGHT_SEARCH_URI = encodeURI(RIGHT_SEARCH);

const WRONG_SEARCH = `ылдвапрдлорвап`;
const WRONG_SEARCH_URI = encodeURI(WRONG_SEARCH);

describe(`When GET '/${PathName.SEARCH}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.SEARCH}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`request '${SEARCH_PARAM}${RIGHT_SEARCH_URI}' should return filtered items by ${RIGHT_SEARCH} in title`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${RIGHT_SEARCH_URI}`);

    const articles = await db.Article.findAll({raw: true});

    const searchResult = articles
      .filter((elem) => elem.title.includes(RIGHT_SEARCH));

    const result = JSON.parse(JSON.stringify(searchResult));

    expect(res.body).toStrictEqual(result);
  });

  test(`blank search returns '${Empty.SEARCH}'`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}`);
    expect(res.body).toStrictEqual(Empty.SEARCH);
  });

  test(`blank request '${SEARCH_PARAM}' returns '${Empty.SEARCH}'`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}`);
    expect(res.body).toStrictEqual(Empty.SEARCH);
  });

  test(`wrong request '${SEARCH_PARAM}${WRONG_SEARCH_URI}' returns '${Empty.SEARCH}'`, async () => {
    const res = await request(app)
      .get(`/${PathName.SEARCH}${SEARCH_PARAM}${WRONG_SEARCH_URI}`);
    expect(res.body).toStrictEqual(Empty.SEARCH);
  });
});
