'use strict';

const express = require(`express`);
const request = require(`supertest`);

const user = require(`./user.js`);
const {UserService} = require(`../data-service`);

const {PathName} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {mocks} = require(`../../data/db/fake/mocks.js`);
const {fakeDb, initDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const userService = new UserService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  user(app, userService);
  return app;
};

beforeAll(async () => {
  await initDb(mocks, fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When POST valid data '/${PathName.USER}'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `example@mail.org`,
    firstname: `Victor`,
    lastname: `Smith`,
    password: `123456`,
    [`repeat_password`]: `123456`,
    avatar: `example.jpg`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.CREATED}`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`response should be 'User is registered'`, () => {
    expect(response.body).toBe(`User is registered`);
  });
});


describe(`When POST valid data '/${PathName.USER}' but email already exist`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `d_ivanov@local.com`, // exist in fake database
    firstname: `Дмитрий`,
    lastname: `Иванов`,
    password: `123456`,
    [`repeat_password`]: `123456`,
    avatar: `example.jpg`,
  };

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `email`,
      message: `Этот email занят`,
    }],
    status: 400,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When POST invalid data '/${PathName.USER}'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `example@mail.local`,
    firstname: `M`,
    lastname: `Smith`,
    password: `1234`,
    [`repeat_password`]: `12345`,
    avatar: ``,
  };

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `email`,
      message: `Невалидный email`,
    }, {
      label: `firstname`,
      message: `Длина должна быть не менее 2 символов`,
    }, {
      label: `password`,
      message: `Длина должна быть не менее 6 символов`,
    }, {
      label: `repeat_password`,
      message: `Пароли не совпали - повторите еще раз`
    }],
    status: 400,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.BAD_REQUEST}`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
