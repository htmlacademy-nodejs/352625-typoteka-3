'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const {
  CommandsNames,
  ExitCode,
} = require(`./constants.js`);

const {generatePosts} = require(`./../utils.js`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
} = require(`./../cli/mocksData.js`);

const writePosts = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    console.info(chalk.green(`Operation success. File created.`));
    process.exit(ExitCode.success);

  } catch (error) {
    console.error(chalk.red(`Can't write data to file...`));
    process.exit(ExitCode.failure);
  }
};

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount >= MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} постов`));
      process.exit(ExitCode.failure);
    }

    const content = JSON.stringify(generatePosts(postsCount));

    writePosts(FILE_NAME, content);
  }
};
