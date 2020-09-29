'use strict';

const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME_FILL,
  CommandsNames,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_PICTURES_PATH,
  FILE_USERS_PATH,
  FILE_COMMENTS_PATH,
  FILE_CATEGORIES_PATH,
  DB_PATH,
  ExitCode,
} = require(`./constants.js`);

const getSqlContent = require(`./../fill-db-tools`);

const {
  getFileData,
  writePosts,
} = require(`./../utils.js`);

const generateContent = async (count) => {
  const [sentences, titles, pictures, users, comments, categories] = await Promise.all([
    getFileData(FILE_SENTENCES_PATH),
    getFileData(FILE_TITLES_PATH),
    getFileData(FILE_PICTURES_PATH),
    getFileData(FILE_USERS_PATH),
    getFileData(FILE_COMMENTS_PATH),
    getFileData(FILE_CATEGORIES_PATH)
  ]);

  const content = getSqlContent(count, sentences, titles, pictures, users, comments, categories);
  writePosts(`${DB_PATH}${FILE_NAME_FILL}`, content);
};

module.exports = {
  name: CommandsNames.FILL,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.FAILURE);
    }

    generateContent(postsCount);
  }
};
