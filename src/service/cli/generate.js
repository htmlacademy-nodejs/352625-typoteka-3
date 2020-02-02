'use strict';

const fs = require(`fs`);

const {
  CommandsNames,
  ExitCode,
  Time
} = require(`./constants.js`);

const {
  getRandomInt,
  shuffle
} = require(`./../utils.js`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  FILE_NAME,
  TITLES,
  SENTENCES,
  CATEGORIES,
} = require(`./../cli/mocks.js`);

const moment = require(`moment`);

const generatePosts = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: moment(Date.now() + getRandomInt(Time.MIN, Time.MAX))
      .format(`YYYY-MM-DD HH:mm:ss`),
    announce: `${shuffle(SENTENCES)
      .slice(0, getRandomInt(1, 5))
      .join(`. `)}.`,
    fullText: `${shuffle(SENTENCES)
      .slice(0, getRandomInt(1, SENTENCES.length))
      .join(`. `)}.`,
    category: shuffle(CATEGORIES)
      .slice(0, getRandomInt(1, CATEGORIES.length)),
  }))
);

module.exports = {
  name: CommandsNames.GENERATE,
  run(args) {
    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount < MAX_COUNT) {
      const content = JSON.stringify(generatePosts(postsCount));
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          return console.error(`Can't write data to file...`);
        }

        return console.info(`Operation success. File created.`);
      });

    } else {
      console.error(`Не больше ${MAX_COUNT} постов`);
      process.exit(ExitCode.failure);
    }
  }
};
