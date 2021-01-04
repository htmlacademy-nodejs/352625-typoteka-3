'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article.js`);
const DataService = require(`../data-service/article.js`);
const CommentService = require(`../data-service/comment.js`);
const UserService = require(`../data-service/user.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const dataService = new DataService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);
const userService = new UserService(fakeDb);

const Author = {
  ID: 1,
};

const Page = {
  ID: `anyId`,
};

const Article = {
  ID: 1,
};

const createAPI = () => {
  const app = express();
  app.use(express.json());
  article(app, dataService, commentService, userService);
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

  const data = {
    title: `Заголовок должен быть не менее 30 символов`,
    createdDate: `14.10.2020, 09:27`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest.jpg`,
    categories: [1, 3],
    userId: Author.ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        message: `Такого пользователя не существует`
      },
    ],
    status: HttpCode.UNAUTHORIZED
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT '/${PathName.ARTICLES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Заголовок должен быть не менее 30 символов`,
    createdDate: `14.10.2020, 09:27`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest`,
    categories: [1, 3],
    userId: Author.ID,
    articleId: Article.ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        message: `Такого пользователя не существует`
      },
    ],
    status: HttpCode.UNAUTHORIZED
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.ARTICLES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST '/${PathName.ARTICLES}/comments' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Текст нового комментария`,
    articleId: Article.ID,
    userId: Author.ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/comments`)
      .send(data);
  });

  const expectedReply = {
    data,
    errors: [
      {
        message: `Такого пользователя не существует`
      },
    ],
    status: HttpCode.UNAUTHORIZED
  };

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    userId: Author.ID,
    articleId: Article.ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        message: `Действие не авторизовано`
      },
    ],
    status: HttpCode.UNAUTHORIZED
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.ARTICLES}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
