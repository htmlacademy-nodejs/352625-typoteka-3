'use strict';

const request = require(`supertest`);

const {getArticle} = require(`./utils/article.js`);
const {getArticles, getArticlesByUserId} = require(`./utils/articles.js`);
const getMostDiscussed = require(`./utils/most-discussed.js`);
const getFreshItems = require(`./utils/fresh-items.js`);

const {app} = require(`./../cli/server.js`);
const {PathName, Empty} = require(`./../routes/constants.js`);
const {HttpCode} = require(`./../cli/constants.js`);

const Article = {
  RIGHT_ID: encodeURI(`1`),
  WRONG_ID: encodeURI(`kdsj6lsd`),
};

const Author = {
  RIGHT_ID: encodeURI(`1`),
  WRONG_ID: encodeURI(`jdhfs5mn`),
};

describe(`When GET '/${PathName.ARTICLES}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock articles from database`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}`);

    const data = await getArticles();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.ARTICLES}/byUser/${Author.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/byUser/${Author.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to author's articles from database`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/byUser/${Author.RIGHT_ID}`);

    const data = await getArticlesByUserId(Author.RIGHT_ID);

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.ARTICLES}/byUser/${Author.WRONG_ID}'`, () => {
  test(`status code should be ${HttpCode.BAD_REQUEST}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/byUser/${Author.WRONG_ID}`);
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to empty array`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/byUser/${Author.WRONG_ID}`);

    const data = [];

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.ARTICLES}/mostDiscussed'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock articles from database`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/mostDiscussed`);

    const data = await getMostDiscussed();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.ARTICLES}/fresh'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/fresh`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock articles from database`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/fresh`);

    const data = await getFreshItems();

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
  });
});

describe(`When GET '/${PathName.ARTICLES}/${Article.RIGHT_ID}'`, () => {
  test(`status code should be ${HttpCode.OK}`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock article with id='${Article.RIGHT_ID}''`, async () => {
    const res = await request(app).get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);

    const data = await getArticle(Article.RIGHT_ID);

    const result = JSON.parse(JSON.stringify(data));

    expect(res.body).toStrictEqual(result);
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

describe(`When POST '/${PathName.ARTICLES}'`, () => {

  test(`status code should be ${HttpCode.OK}`, async () => {
    const mockArticle = {
      json: {
        [`title`]: `text`,
        [`created_date`]: `2020-03-10 06:35:58`,
        [`announce`]: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        [`full_text`]: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
        [`picture`]: `forest`,
      }
    };

    const res = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);

    expect(res.statusCode).toBe(HttpCode.OK);

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
