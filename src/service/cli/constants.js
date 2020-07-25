'use strict';

const DEFAULT_COUNT = 1;

const MAX_COUNT = 1000;

const FILE_NAME = `mocks.json`;

const CommandsNames = {
  VERSION: `--version`,
  GENERATE: `--generate`,
  HELP: `--help`,
  SERVER: `--server`,
};

const DEFAULT_COMMAND = CommandsNames.HELP;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const Time = {
  MIN: -(1000 * 60 * 60 * 24 * 30 * 3), // 3 months in milliseconds
  MAX: 0,
};

const FILE_SENTENCES_PATH = `./src/data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;
const FILE_COMMENTS_PATH = `./src/data/comments.txt`;
const FILE_USERS_PATH = `./src/data/users.txt`;
const FILE_PICTURES_PATH = `./src/data/pictures.txt`;

const DEFAULT_API_PORT = 3000;
const URL_API = `http://localhost:${DEFAULT_API_PORT}`;

const HttpCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const Id = {
  Length: {
    POST: 6,
    COMMENT: 4,
    CATEGORY: 4,
  },
  Restrict: {
    MIN: 0,
    MAX: 10,
  },
  Phrases: {
    MIN: 2,
    MAX: 5,
  }
};

const Category = {
  Restrict: {
    MIN: 2,
    MAX: 3,
  },
};

module.exports = {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  CommandsNames,
  Time,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH,
  FILE_COMMENTS_PATH,
  FILE_USERS_PATH,
  FILE_PICTURES_PATH,
  DEFAULT_API_PORT,
  URL_API,
  HttpCode,
  Id,
  Category,
};
