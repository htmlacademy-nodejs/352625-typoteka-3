'use strict';

const moment = require(`moment`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const {
  Time,
  ExitCode,
} = require(`./cli/constants.js`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const makeList = (text) => text
  .replace(/\r?\n/g, ` `)
  .split(`. `)
  .slice(0, -1);

const getFileData = async (path) => {
  const readFile = promisify(fs.readFile);

  try {
    return makeList(await readFile(path, `utf8`));

  } catch (error) {
    console.error(`Can't read data from file... ${error}`);
    return process.exit(ExitCode.FAILURE);
  }
};

const writePosts = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    console.info(chalk.green(`Operation success. File created.`));

  } catch (error) {
    console.error(chalk.red(`Can't write data to file...`));
    process.exit(ExitCode.FAILURE);
  }
};

const generatePosts = (count, sentences, categories, titles) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: moment(Date.now() + getRandomInt(Time.MIN, Time.MAX))
      .format(`YYYY-MM-DD HH:mm:ss`),
    announce: `${shuffle(sentences)
      .slice(0, getRandomInt(1, 5))
      .join(`. `)}.`,
    fullText: `${shuffle(sentences)
      .slice(0, getRandomInt(1, sentences.length))
      .join(`. `)}.`,
    category: shuffle(categories)
      .slice(0, getRandomInt(1, categories.length)),
  }))
);

module.exports = {
  getRandomInt,
  shuffle,
  generatePosts,
  getFileData,
  writePosts
};
