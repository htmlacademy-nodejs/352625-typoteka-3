'use strict';

const moment = require(`moment`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);
const nanoid = require(`nanoid`);
const {getLogger} = require(`./logger.js`);

const logger = getLogger();

const {
  Time,
  ExitCode,
  Id,
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

const getComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.COMMENT),
    text: `${shuffle(comments).slice(1, getRandomInt(Id.Phrases.MIN, Id.Phrases.MAX)).join(`. `)}.`,
  }))
);

const generatePosts = (count, sentences, categories, titles, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.POST),
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
    comments: getComments(getRandomInt(Id.Restrict.MIN, Id.Restrict.MAX), comments)
  }))
);

const createLogs = (req, res, path) => {
  logger.debug(`Client request to url /${path}${req.url}`);
  logger.info(`End request with status code ${res.statusCode}`);
};

const createErrorLogs = (error) => {
  logger.error(`No content, ${error}`);
};

module.exports = {
  getRandomInt,
  shuffle,
  generatePosts,
  getFileData,
  writePosts,
  createLogs,
  createErrorLogs,
};
