'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category.js`);
const {CategoryService, UserService} = require(`../data-service`);

const {PathName, Empty} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const User = {
  ID: 1,
};

const Category = {
  ID: `randomId`,
};

const Page = {
  ID: `randomPage`,
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
  await initEmptyDb(fakeSequelize);
});


afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});


describe(`When GET '/${PathName.CATEGORIES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to ${Empty.CATEGORIES}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORIES);
  });
});


describe(`When GET '/${PathName.CATEGORIES}/id=${Category.ID}&page=${Page.ID}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/${PathName.CATEGORIES}/id=${Category.ID}&page=${Page.ID}`);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be equal to to ${Empty.CATEGORY}`, () => {
    expect(response.body).toStrictEqual(Empty.CATEGORY);
  });
});


describe(`When POST '/${PathName.CATEGORIES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    category: `Категория новая`,
    userId: User.ID
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`,
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.CATEGORIES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When PUT '/${PathName.CATEGORIES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  let response;

  const data = {
    category: `Категория обновленная`,
    categoryId: Category.ID,
    userId: User.ID,
  };

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`,
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/${PathName.CATEGORIES}`)
      .send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When DELETE '/${PathName.CATEGORIES}' to empty database '${fakeSequelize.config.database}'`, () => {
  const app = createAPI();

  const data = {
    userId: User.ID,
    categoryId: Category.ID,
  };

  let response;

  const expectedReply = {
    data,
    status: HttpCode.UNAUTHORIZED,
    errors: [{
      message: `Такого пользователя не существует`,
    }]
  };

  beforeAll(async () => {
    response = await request(app)
      .delete(`/${PathName.CATEGORIES}`).send(data);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
