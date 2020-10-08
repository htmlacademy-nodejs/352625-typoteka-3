'use strict';

const chalk = require(`chalk`);

const {sequelize, initDb} = require(`./../../data/db/db.js`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  CommandsNames,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_PICTURES_PATH,
  FILE_USERS_PATH,
  FILE_COMMENTS_PATH,
  FILE_CATEGORIES_PATH,
  ExitCode,
} = require(`./constants.js`);

const {
  AUTH_USER_ID,
} = require(`./../filldb-tools/constants.js`);

const getContent = require(`./../filldb-tools`);

const {getFileData} = require(`./../utils.js`);

const generateContent = async (count, authUserId) => {
  const [
    sentences,
    titles,
    pictures,
    users,
    comments,
    categories
  ] = await Promise.all([
    getFileData(FILE_SENTENCES_PATH),
    getFileData(FILE_TITLES_PATH),
    getFileData(FILE_PICTURES_PATH),
    getFileData(FILE_USERS_PATH),
    getFileData(FILE_COMMENTS_PATH),
    getFileData(FILE_CATEGORIES_PATH)
  ]);

  return getContent(
      count,
      users,
      authUserId,
      sentences,
      titles,
      pictures,
      comments,
      categories
  );
};

module.exports = {
  name: CommandsNames.FILL_DB,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.FAILURE);
    }

    (async () => {
      const content = await generateContent(postsCount, AUTH_USER_ID);
      await initDb(content);
      await sequelize.close();
    })();

  }
};
