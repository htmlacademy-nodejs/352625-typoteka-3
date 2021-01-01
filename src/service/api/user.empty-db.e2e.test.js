'use strict';

const express = require(`express`);
const request = require(`supertest`);

const user = require(`./user.js`);
const {UserService} = require(`../data-service`);

const {PathName} = require(`./constants.js`);
const {HttpCode} = require(`../cli/constants.js`);
const {fakeDb, initEmptyDb, dropDb, fakeSequelize} = require(`../../data/db/fake`);

const userService = new UserService(fakeDb);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  user(app, userService);
  return app;
};

beforeAll(async () => {
  await initEmptyDb(fakeSequelize);
});

afterAll(async () => {
  await dropDb(fakeSequelize);
  await fakeSequelize.close();
});

describe(`When try to register with valid data '/${PathName.USER}'`, () => {
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


describe(`When try to register with invalid data '/${PathName.USER}'`, () => {
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


describe(`When try to login by non-existing user '/${PathName.USER}/login'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `not_exist@local.com`, // not exist in fake database
    password: `random 123456`, // random password
  };

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `email`,
      message: `Такого пользователя не существует`,
    }],
    status: 401,
  };


  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}/login`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});


describe(`When try to login by existing user and correct password '/${PathName.USER}/login'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `example@mail.org`, // exist in fake database
    password: `123456`, // correct password
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}/login`)
      .send(mockUser);
  });

  test(`status code should be ${HttpCode.OK}`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`response should be 'User is authenticated'`, () => {
    expect(response.body).toBe(`User is authenticated`);
  });
});


describe(`When try to login by existing user and incorrect password '/${PathName.USER}/login'`, () => {
  const app = createAPI();

  let response;

  const mockUser = {
    email: `example@mail.org`, // exist in fake database
    password: `12345678910`, // incorrect password
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/${PathName.USER}/login`)
      .send(mockUser);
  });

  const expectedReply = {
    data: mockUser,
    errors: [{
      label: `password`,
      message: `Невалидный пароль`,
    }],
    status: HttpCode.UNAUTHORIZED,
  };


  test(`status code should be ${HttpCode.UNAUTHORIZED}`, () => {
    expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
  });

  test(`response should be an object with special structure`, () => {
    expect(response.body).toStrictEqual(expectedReply);
  });
});
