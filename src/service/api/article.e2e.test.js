'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article.js`);
const DataService = require(`../data-service/article.js`);
const AuthService = require(`../data-service/auth.js`);
const CommentService = require(`../data-service/comment.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);
const {loginByAuthorId, logoutByAuthorId} = require(`./test-utils.js`);

const dataService = new DataService(fakeDb, fakeSequelize);
const authService = new AuthService(fakeDb);
const commentService = new CommentService(fakeDb);

const Author = {
  RIGHT_ID: encodeURI(`1`),
  WRONG_ID: encodeURI(`jds3ve4n`),
};

const Article = {
  RIGHT_ID: encodeURI(`1`),
  WRONG_ID: encodeURI(`kdsj6lsd`),
  NON_EXIST_ID: encodeURI(`1234567`),
};

const Page = {
  RIGHT_ID: 1,
  WRONG_ID: `wr0ng1d`,
};


const createAPI = () => {
  const app = express();
  app.use(express.json());
  article(app, dataService, authService, commentService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When GET '/${PathName.ARTICLES}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findAll();
    response = await request(app)
      .get(`/${PathName.ARTICLES}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to articles from fake database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/byAuthor/${Author.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findAllByAuthor(Author.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.ARTICLES}/byAuthor/${Author.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to author's articles from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/byAuthor/${Author.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/byAuthor/${Author.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to '${Empty.ARTICLES}'`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/mostDiscussed'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findMostDiscussed();
    response = await request(app)
      .get(`/${PathName.ARTICLES}/mostDiscussed`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to list of most discussed articles`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/fresh/page=${Page.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findFresh(Page.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.ARTICLES}/fresh/page=${Page.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to page ${Page.RIGHT_ID} of most fresh articles`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/fresh/page=${Page.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/fresh/page=${Page.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLES}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLES);
  });
});


describe(`When GET '/${PathName.ARTICLES}/${Article.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findOne(Article.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });


  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to mock article with id='${Article.RIGHT_ID}''`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/${Article.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.ARTICLE}`, () => {
    expect(response.body).toStrictEqual(Empty.ARTICLE);
  });
});


describe(`When POST '/${PathName.ARTICLES}' in login mode`, () => {
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
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Article is added'`, () => {
    expect(response.body).toBe(`Article is added`);
  });

});


describe(`When POST '/${PathName.ARTICLES}' in logout mode`, () => {
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

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.RIGHT_ID}' in login mode`, () => {
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
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`)
      .send(mockArticle);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Article is changed'`, () => {
    expect(response.body).toBe(`Article is changed`);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.RIGHT_ID}' in logout mode`, () => {
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

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    [`title`]: `Название нового заголовка`,
    [`created_date`]: `14.10.2020`,
    [`announce`]: `Исправленная аннотация поста`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.WRONG_ID}`)
      .send(mockArticle);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Incorrect id'`, () => {
    expect(response.body).toBe(`Incorrect id`);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.NON_EXIST_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    [`title`]: `Название нового заголовка`,
    [`created_date`]: `14.10.2020`,
    [`announce`]: `Исправленная аннотация поста`,
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.NON_EXIST_ID}`)
      .send(mockArticle);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Article doesn't exist'`, () => {
    expect(response.body).toBe(`Article doesn't exist`);
  });
});


describe(`When PUT '/${PathName.ARTICLES}/${Article.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    [`title`]: `Название нового заголовка`,
    [`created_date`]: `14.10.2020`,
    [`announce`]: `Исправленная аннотация поста`,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.ARTICLES}/${Article.WRONG_ID}`)
      .send(mockArticle);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    text: `Текст нового комментария`
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Comment is added'`, () => {
    expect(response.body).toBe(`Comment is added`);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.RIGHT_ID}/comments' in logout mode`, () => {
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

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.WRONG_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    json: {text: `Текст нового комментария`}
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Incorrect id'`, () => {
    expect(response.body).toBe(`Incorrect id`);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.NON_EXIST_ID}/comments' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    json: {text: `Текст нового комментария`}
  };

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.ARTICLES}/${Article.NON_EXIST_ID}/comments`)
      .send(mockComment);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Incorrect id'`, () => {
    expect(response.body).toBe(`Article doesn't exist`);
  });
});


describe(`When POST '/${PathName.ARTICLES}/${Article.WRONG_ID}/comments' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockComment = {
    json: {text: `Текст нового комментария`}
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/${Article.WRONG_ID}/comments`)
      .send(mockComment);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.RIGHT_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;
  let articleBeforeAction;
  let articleAfterAction;

  beforeAll(async () => {
    articleBeforeAction = await dataService.findOne(Article.RIGHT_ID);

    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });

  test(`Article is not deleted`, () => {
    expect(articleBeforeAction).toStrictEqual(articleAfterAction);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;
  let articleAfterAction;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);

    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.RIGHT_ID}`);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Response is 'Article is deleted'`, () => {
    expect(response.body).toBe(`Article is deleted`);
  });

  test(`Article is deleted`, () => {
    expect(articleAfterAction).toBeNull();
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response is 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.WRONG_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Incorrect id'`, () => {
    expect(response.body).toBe(`Incorrect id`);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}/${Article.NON_EXIST_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(Author.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.ARTICLES}/${Article.NON_EXIST_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(Author.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Article doesn't exist'`, () => {
    expect(response.body).toBe(`Article doesn't exist`);
  });
});
