'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article.js`);
const DataService = require(`../data-service/article.js`);
const AuthService = require(`../data-service/auth.js`);
const CommentService = require(`../data-service/comment.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const dataService = new DataService(fakeDb, fakeSequelize);
const authService = new AuthService(fakeDb);
const commentService = new CommentService(fakeDb);

const Author = {
  ID: `randomId`,
};

const Page = {
  ID: `anyId`,
};

const Article = {
  ID: `randomId`,
};

const createAPI = () => {
  const app = express();
  app.use(express.json());
  article(app, dataService, authService, commentService);
  return app;
};


beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});


afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.ARTICLES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/byAuthor/${Author.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/byAuthor/${Author.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/mostDiscussed' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/mostDiscussed`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/fresh/page=${Page.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/fresh/page=${Page.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/${Article.RIGHT_ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLE);
  });
});


describe(`When POST '/${PathName.ARTICLES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    [`title`]: `text`,
    [`created_date`]: `14.10.2020`,
    [`announce`]: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    [`full_text`]: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    [`picture`]: `forest`,
    [`category-1`]: 1,
    [`category-2`]: 2,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be equal to ${Empty.ARTICLE}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLE);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    [`title`]: `Название нового заголовка`,
    [`created_date`]: `14.10.2020`,
    [`announce`]: `Исправленная аннотация поста`,
    [`full_text`]: `Исправленный полный текст публикации`,
    [`picture`]: `picture`,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`)
      .send(mockArticle);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be equal to ${Empty.ARTICLE}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLE);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.ID}/comments' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments`)
      .send(mockComment);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be equal to ${Empty.COMMENT}`, () => {
    expect(response.body).toStrictEqual(Empty.COMMENT);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be equal to ${Empty.ARTICLE}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLE);
  });
});
