'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article.js`);
const DataService = require(`../data-service/article.js`);
const CommentService = require(`../data-service/comment.js`);
const UserService = require(`../data-service/user.js`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const dataService = new DataService(fakeDb, fakeSequelize);
const commentService = new CommentService(fakeDb);
const userService = new UserService(fakeDb);

const User = {
  ADMIN_ID: 1,
  NOT_ADMIN_ID: 2,
  WRONG_ID: 1000,
};

const Article = {
  RIGHT_ID: 1,
  WRONG_ID: 10000,
};

const Page = {
  RIGHT_ID: 1,
  WRONG_ID: `wr0ng1d`,
};


const createAPI = () => {
  const app = express();
  app.use(express.json());
  article(app, dataService, commentService, userService);
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


describe(`When GET '/${PathName.ARTICLES}/byAuthor/${User.ADMIN_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await dataService.findAllByAuthor(User.ADMIN_ID);
    response = await request(app)
      .get(`/${PathName.ARTICLES}/byAuthor/${User.ADMIN_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to author's articles from database`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.ARTICLES}/byAuthor/${User.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.ARTICLES}/byAuthor/${User.WRONG_ID}`);
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


describe(`When POST invalid data '/${PathName.ARTICLES}'`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    createdDate: `14 ноября 2020 года`,
    title: `Невалидный заголовок`,
    categories: [],
    announce: `Невалидный анонс`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `desert.jpg`,
    userId: User.ADMIN_ID,
  };

  const expectedReply = {
    data: mockArticle,
    errors: [
      {
        label: `createdDate`,
        message: `Требуемый формат даты: 'DD.MM.YYYY, HH:mm'`
      },
      {
        label: `title`,
        message: `Длина должна быть не менее 30 символов`
      },
      {
        label: `categories`,
        message: `Выберите хотя бы одну категорию`
      },
      {
        label: `announce`,
        message: `Длина должна быть не менее 30 символов`
      }
    ],
    status: HttpCode.BAD_REQUEST
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When POST valid data '/${PathName.ARTICLES}'`, () => {
  const app = createAPI();

  let response;

  const mockArticle = {
    createdDate: `14.10.2020, 09:27`,
    title: `Заголовок должен быть не менее 30 символов`,
    categories: [1, 3],
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest.jpg`,
    userId: User.ADMIN_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}`)
      .send(mockArticle);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Article is added'`, () => {
    expect(response.body).toBe(`Article is added`);
  });

});


describe(`When PUT invalid data '/${PathName.ARTICLES}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Невалидный заголовок`,
    createdDate: `14 января 2019 г.`,
    announce: `Невалидный анонс`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    categories: [],
    userId: User.ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        label: `createdDate`,
        message: `Требуемый формат даты: 'DD.MM.YYYY, HH:mm'`
      },
      {
        label: `title`,
        message: `Длина должна быть не менее 30 символов`
      },
      {
        label: `categories`,
        message: `Выберите хотя бы одну категорию`
      },
      {
        label: `announce`,
        message: `Длина должна быть не менее 30 символов`
      },
    ],
    status: HttpCode.BAD_REQUEST
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.ARTICLES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT valid data '/${PathName.ARTICLES}' in case: User is Admin`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Заголовок должен быть не менее 30 символов`,
    createdDate: `14.10.2020, 09:27`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest.jpg`,
    categories: [1, 2],
    userId: User.ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.ARTICLES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Article is changed'`, () => {
    expect(response.body).toBe(`Article is changed`);
  });
});


describe(`When PUT valid data '/${PathName.ARTICLES}' in case: User is not Admin`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Заголовок должен быть не менее 30 символов`,
    createdDate: `14.10.2020, 09:27`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest.jpg`,
    categories: [1, 2],
    userId: User.NOT_ADMIN_ID,
    articleId: Article.RIGHT_ID,
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


describe(`When PUT any data '/${PathName.ARTICLES}' in case: Article is not exist`, () => {
  const app = createAPI();

  let response;

  const data = {
    title: `Заголовок должен быть не менее 30 символов`,
    createdDate: `14.10.2020, 09:27`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    picture: `forest.jpg`,
    categories: [1, 2],
    userId: User.ADMIN_ID,
    articleId: Article.WRONG_ID,
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


describe(`When POST valid data '/${PathName.ARTICLES}/comments' in case: User is logged in, Article is exist`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Текст нового валидного комментария`,
    userId: User.NOT_ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/comments`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Response is 'Comment is added'`, () => {
    expect(response.body).toBe(`Comment is added`);
  });
});


describe(`When POST invalid data '/${PathName.ARTICLES}/comments'  in case: User is logged in, Article is exist`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Текст`,
    userId: User.NOT_ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  const unvalidReply = {
    data,
    errors: [
      {
        label: `text`,
        message: `Длина должна быть не менее 20 символов`,
      },
    ],
    status: HttpCode.BAD_REQUEST,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/comments`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response is 'Comment is added'`, () => {
    expect(response.body).toStrictEqual(unvalidReply);
  });
});


describe(`When POST valid data '/${PathName.ARTICLES}/comments' in case: User is logged in, Article is not exist`, () => {
  const app = createAPI();

  let response;

  const data = {
    text: `Текст нового комментария`,
    userId: User.NOT_ADMIN_ID,
    articleId: Article.WRONG_ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.BAD_REQUEST,
    errors: [{
      message: `Такой публикации не существует`,
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.ARTICLES}/comments`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}' in case: Article and User are not exist`, () => {
  const app = createAPI();

  const data = {
    userId: User.WRONG_ID,
    articleId: Article.WRONG_ID,
  };

  let response;
  let articleBeforeAction;
  let articleAfterAction;

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED};

  beforeAll(async () => {
    articleBeforeAction = await dataService.findOne(Article.RIGHT_ID);

    response = await request(app)
      .delete(`/${PathName.ARTICLES}`).send(data);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be ${expectedReply}`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Article is not deleted`, () => {
    expect(articleBeforeAction).toStrictEqual(articleAfterAction);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}' in case: Article exists, but User is not exist`, () => {
  const app = createAPI();

  const data = {
    userId: User.WRONG_ID,
    articleId: Article.RIGHT_ID,
  };

  let response;
  let articleBeforeAction;
  let articleAfterAction;

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED};

  beforeAll(async () => {
    articleBeforeAction = await dataService.findOne(Article.RIGHT_ID);

    response = await request(app)
      .delete(`/${PathName.ARTICLES}`).send(data);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be ${expectedReply}`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Article is not deleted`, () => {
    expect(articleBeforeAction).toStrictEqual(articleAfterAction);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}' in case: Article and User are exist, but User is not an Author of Article`, () => {
  const app = createAPI();

  const data = {
    userId: User.NOT_ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  let response;
  let articleBeforeAction;
  let articleAfterAction;

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED};

  beforeAll(async () => {
    articleBeforeAction = await dataService.findOne(Article.RIGHT_ID);

    response = await request(app)
      .delete(`/${PathName.ARTICLES}`).send(data);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`Response should be ${expectedReply}`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

  test(`Article is not deleted`, () => {
    expect(articleBeforeAction).toStrictEqual(articleAfterAction);
  });
});


describe(`When DELETE '/${PathName.ARTICLES}' in case: Article and User are exist, and User is Author of Article`, () => {
  const app = createAPI();

  const data = {
    userId: User.ADMIN_ID,
    articleId: Article.RIGHT_ID,
  };

  let response;
  let articleAfterAction;

  const expectedReply = `Article is deleted`;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.ARTICLES}`).send(data);

    articleAfterAction = await dataService.findOne(Article.RIGHT_ID);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Response should be ${expectedReply}`, () => {
    expect(response.body).toBe(expectedReply);
  });

  test(`Try to find Article in db after action`, () => {
    expect(articleAfterAction).toBeNull();
  });
});
