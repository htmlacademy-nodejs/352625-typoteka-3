'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category.js`);
const {CategoryService, AuthService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);
const {loginByAuthorId, logoutByAuthorId} = require(`./test-utils.js`);

const Category = {
  RIGHT_ID: 1,
  WRONG_ID: `jskdh`,
};

const Page = {
  RIGHT_ID: 1,
  WRONG_ID: `wr0ngpag3`,
};

const User = {
  RIGHT_ID: 1,
  WRONG_ID: `sdmf`
};

const categoryService = new CategoryService(fakeDb, fakeSequelize);
const authService = new AuthService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  category(app, categoryService, authService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.CATEGORIES}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await categoryService.findAll();
    response = await request(app)
      .get(`/${PathName.CATEGORIES}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to categories from db`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/id=${Category.RIGHT_ID}&page=${Page.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;
  let result;

  beforeAll(async () => {
    const data = await categoryService.findOne(Category.RIGHT_ID, Page.RIGHT_ID);
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/id=${Category.RIGHT_ID}&page=${Page.RIGHT_ID}`);
    result = JSON.parse(JSON.stringify(data));
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be equal to category data from db`, () => {
    expect(response.body).toStrictEqual(result);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/id=${Category.WRONG_ID}$page=${Page.RIGHT_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/id=${Category.WRONG_ID}$page=${Page.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.NOT_FOUND}`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`response should be equal to ${Empty.CATEGORY}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORY);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/id=${Category.RIGHT_ID}&page=${Page.WRONG_ID}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/id=${Category.RIGHT_ID}&page=${Page.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to to ${Empty.CATEGORY}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORY);
  });
});


describe(`When POST valid data '/${PathName.CATEGORIES}/add' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Категория новая`
  };

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.CATEGORIES}/add`)
      .send(mockCategory);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'Category is added'`, () => {
    expect(response.body).toBe(`Category is added`);
  });
});


describe(`When POST any data '/${PathName.CATEGORIES}/add' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    text: `Здесь могут быть`,
    text2: `любые данные`
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.CATEGORIES}/add`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When POST invalid data '/${PathName.CATEGORIES}/add' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `А`
  };

  const expectedReply = {
    data: {
      category: `А`
    },
    errors: [
      {
        label: `category`,
        message: `Длина должна быть не менее 2 символов`
      }
    ],
    status: 400
  };

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .post(`/${PathName.CATEGORIES}/add`)
      .send(mockCategory);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an objecy with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT valid data '/${PathName.CATEGORIES}/${Category.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Категория обновленная`
  };

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`)
      .send(mockCategory);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'Category is updated'`, () => {
    expect(response.body).toBe(`Category is updated`);
  });
});


describe(`When PUT invalid data '/${PathName.CATEGORIES}/${Category.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Невалидная категория длиной более 30 символов`
  };

  const expectedReply = {
    data: {
      category: `Невалидная категория длиной более 30 символов`
    },
    errors: [
      {
        label: `category`,
        message: `Длина не должна превышать 30 символов`
      }
    ],
    status: 400
  };

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`)
      .send(mockCategory);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an objecy with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT any data '/${PathName.CATEGORIES}/${Category.RIGHT_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    text: `Здесь могут быть`,
    text2: `любые данные`
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When PUT valid data '/${PathName.CATEGORIES}/${Category.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Категория обновленная`
  };

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .put(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`)
      .send(mockCategory);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be 'Incorrect id'`, () => {
    expect(response.body).toBe(`Incorrect id`);
  });

});


describe(`When PUT any data '/${PathName.CATEGORIES}/${Category.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    text: `Здесь могут быть`,
    text2: `любые данные`
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}/${Category.RIGHT_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.OK} and response is 'Category is deleted'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toBe(`Category is deleted`);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}/${Category.RIGHT_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}/${Category.RIGHT_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}/${Category.WRONG_ID}' in login mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    await loginByAuthorId(User.RIGHT_ID, fakeDb);
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`);
  });

  afterAll(async () => {
    await logoutByAuthorId(User.RIGHT_ID, fakeDb);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response is 'Incorrect id'`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toBe(`Incorrect id`);
  });

});


describe(`When DELETE '/${PathName.CATEGORIES}/${Category.WRONG_ID}' in logout mode`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}/${Category.WRONG_ID}`);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be 'Unauthorized access'`, () => {
    expect(response.body).toBe(`Unauthorized access`);
  });
});
