'use strict';

const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  CommandsNames,
  ExitCode,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH,
} = require(`./constants.js`);

const {
  generatePosts,
  getFileData,
  writePosts,
} = require(`./../utils.js`);

const generateContent = async (countOffer) => {
  const [sentences, categories, titles] = await Promise.all([
    getFileData(FILE_SENTENCES_PATH),
    getFileData(FILE_CATEGORIES_PATH),
    getFileData(FILE_TITLES_PATH),
  ]);

  const content = JSON
    .stringify(generatePosts(countOffer, sentences, categories, titles));

  writePosts(FILE_NAME, content);
};

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} постов`));
      process.exit(ExitCode.FAILURE);
    }

    generateContent(postsCount);
  }
};
