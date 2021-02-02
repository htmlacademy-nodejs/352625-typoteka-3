'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category.js`);
const {CategoryService, UserService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const Category = {
  RIGHT_ID: 1,
  ID_WITHOUT_ARTICLES: 5,
  WRONG_ID: 10000,
};

const Page = {
  RIGHT_ID: 1,
  WRONG_ID: `wr0ngpag3`,
};

const User = {
  ADMIN_ID: 1,
  NOT_ADMIN_ID: 2,
  WRONG_ID: `sdmf`
};

const categoryService = new CategoryService(fakeDb, fakeSequelize);
const userService = new UserService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  category(app, categoryService, userService);
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


describe(`When POST valid data '/${PathName.CATEGORIES}' in admin mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Категория новая`,
    userId: User.ADMIN_ID
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.CATEGORIES}`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'Category is added'`, () => {
    expect(response.body).toBe(`Category is added`);
  });
});


describe(`When POST invalid data '/${PathName.CATEGORIES}' in admin mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `А`,
    userId: User.ADMIN_ID
  };

  const expectedReply = {
    data: mockCategory,
    errors: [
      {
        label: `category`,
        message: `Длина должна быть не менее 5 символов`
      }
    ],
    status: 400
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.CATEGORIES}`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an objecy with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST any data '/${PathName.CATEGORIES}' in user mode`, () => {
  const app = createAPI();

  let response;

  const mockCategory = {
    category: `Категория новая`,
    userId: User.NOT_ADMIN_ID,
  };

  const expectedReply = {
    data: mockCategory,
    errors: [{
      message: `Действие не авторизовано`
    }],
    status: HttpCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.CATEGORIES}`)
      .send(mockCategory);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT valid data '/${PathName.CATEGORIES}' in admin mode (correct categoryId)`, () => {
  const app = createAPI();

  let response;

  const data = {
    category: `Категория обновленная`,
    categoryId: Category.RIGHT_ID,
    userId: User.ADMIN_ID,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'Category is updated'`, () => {
    expect(response.body).toBe(`Category is updated`);
  });
});


describe(`When PUT invalid data '/${PathName.CATEGORIES}' in admin mode (correct categoryId)`, () => {
  const app = createAPI();

  let response;

  const data = {
    category: `Невалидная категория длиной более 30 символов`,
    categoryId: Category.RIGHT_ID,
    userId: User.ADMIN_ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        label: `category`,
        message: `Длина не должна превышать 30 символов`
      }
    ],
    status: 400
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT valid data '/${PathName.CATEGORIES}' in admin mode (incorrect categoryId)`, () => {
  const app = createAPI();

  let response;

  const data = {
    category: `Категория обновленная`,
    categoryId: Category.WRONG_ID,
    userId: User.ADMIN_ID,
  };

  const expectedReply = {
    data,
    errors: [
      {
        message: `Действие не авторизовано`,
      }
    ],
    status: HttpCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure'`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });

});


describe(`When DELETE '/${PathName.CATEGORIES}' in case: User is not Admin`, () => {
  const app = createAPI();

  const data = {
    userId: User.NOT_ADMIN_ID,
    categoryId: Category.RIGHT_ID,
  };

  let response;

  const expectedReply = {
    data,
    errors: [{
      message: `Действие не авторизовано`,
    }],
    status: HttpCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED} and response should be an object with special structure`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}' in case: User is Admin, Category is not empty`, () => {
  const app = createAPI();

  const data = {
    userId: User.ADMIN_ID,
    categoryId: Category.RIGHT_ID,
  };

  let response;

  const expectedReply = {
    data,
    errors: [{
      label: `category`,
      message: `Категория содержит публикации`,
    }],
    status: HttpCode.BAD_REQUEST,
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}`).send(data);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST} and response should be an object with special structure`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}' in case: User is Admin, Category is empty`, () => {
  const app = createAPI();

  const data = {
    userId: User.ADMIN_ID,
    categoryId: Category.ID_WITHOUT_ARTICLES,
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}`).send(data);
  });

  test(`status code should be ${HttpCode.OK} and response should be 'Category is deleted'`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toBe(`Category is deleted`);
  });
});
