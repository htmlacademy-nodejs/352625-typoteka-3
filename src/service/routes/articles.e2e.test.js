'use strict';

const request = require(`supertest`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty} = require(`./../routes/constants.js`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {FILE_NAME, HttpCode} = require(`./../cli/constants.js`);

const readFile = promisify(fs.readFile);

const Article = {
  RIGHT_ID: encodeURI(`qeD86W`),
  WRONG_ID: encodeURI(`ылдвапр`),
};

const Comment = {
  RIGHT_ID: encodeURI(`0n3R`),
  WRONG_ID: encodeURI(`фжыдвл`),
};

describe(`When GET '/${PathName.ARTICLES}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock articles from '${FILE_NAME}'`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}`);
    const mockArticles = JSON.parse(await readFile(FILE_NAME));
    expect(res.body).toStrictEqual(mockArticles);
  });
});

describe(`When GET '/${PathName.ARTICLES}/${Article.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock article with id='${Article.RIGHT_ID}''`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
    const mockArticle = JSON.parse(await readFile(FILE_NAME))
      .filter((elem) => elem.id === Article.RIGHT_ID)[0];

    expect(res.body).toStrictEqual(mockArticle);
  });
});

describe(`When GET '/${PathName.ARTICLES}/${Article.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLE}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
    expect(res.body).toStrictEqual(Empty.ARTICLE);
  });
});

describe(`When GET '/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to comments from '${FILE_NAME}'`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments`);
    const mockComments = JSON.parse(await readFile(FILE_NAME))
      .filter((elem) => elem.id === Article.RIGHT_ID)[0].comments;

    expect(res.body).toStrictEqual(mockComments);

  });
});

describe(`When GET '/${PathName.ARTICLES}/${Article.WRONG_ID}/comments'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be be equal to '${Empty.COMMENTS}'`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments`);
    expect(res.body).toStrictEqual(Empty.COMMENTS);
  });
});

describe(`When POST '/${PathName.ARTICLES}'`, () => {
  const mockArticle = {title: `text`, createdDate: `2020-03-10 06:35:58`};

  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockArticle);
  });
});

describe(`When PUT '/${PathName.ARTICLES}/${Article.RIGHT_ID}'`, () => {
  const mockArticle = {title: `text`, createdDate: `2020-03-10 06:35:58`};

  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`)
      .send(mockArticle);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be the same as request object`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`)
      .send(mockArticle);

    expect(res.body).toStrictEqual(mockArticle);
  });
});

describe(`When PUT '/${PathName.ARTICLES}/${Article.WRONG_ID}'`, () => {
  const mockArticle = {title: `text`, createdDate: `2020-03-10 06:35:58`};

  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.WRONG_ID}`)
      .send(mockArticle);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to '${Empty.ARTICLE}'`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.WRONG_ID}`)
      .send(mockArticle);

    expect(res.body).toStrictEqual(Empty.ARTICLE);
  });
});

describe(`When PUT '/${PathName.ARTICLES}/:ID/comments'`, () => {
  const mockComment = {id: `id01`, text: `some comment text`};

  test(`if ID is correct status code should be 200 and response should be the same as request object`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments`)
      .send(mockComment);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockComment);
  });

  test(`if ID is wrong status code should be 400 and response should be equal to '${Empty.COMMENT}'`, async () => {
    const res = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments`)
      .send(mockComment);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body).toStrictEqual(Empty.COMMENT);
  });
});

describe(`When DELETE '/${PathName.ARTICLES}/${Article.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });
});

describe(`When DELETE '/${PathName.ARTICLES}/${Article.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

describe(`When DELETE '/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments/${Comment.RIGHT_ID}'`, () => {
//   test(`status code should be ${HttpCode.OK}`, async () => {
//     const res = await request(app).delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments/${Comment.RIGHT_ID}`);
//     expect(res.statusCode).toBe(HttpCode.OK);
//   });
});

describe(`When DELETE '/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

describe(`When DELETE '/${PathName.ARTICLES}/${Article.WRONG_ID}/comments/${Comment.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).delete(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments/${Comment.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
