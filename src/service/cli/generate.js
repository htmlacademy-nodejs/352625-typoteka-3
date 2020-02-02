'use strict';

const fs = require(`fs`);

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

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount < MAX_COUNT) {
      const content = JSON.stringify(generatePosts(postsCount));
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          console.error(`Can't write data to file...`);
          process.exit(ExitCode.failure);
        }

        console.info(`Operation success. File created.`);
        process.exit(ExitCode.success);
      });

    } else {
      console.error(`Не больше ${MAX_COUNT} постов`);
      process.exit(ExitCode.failure);
    }
  }
};
