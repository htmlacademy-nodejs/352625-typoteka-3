'use strict';

const moment = require(`moment`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);
const nanoid = require(`nanoid`);

const {
  Time,
  ExitCode,
  Id,
  Category,
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

const getDate = () => {
  const date = Date.now() + getRandomInt(Time.MIN, Time.MAX);
  return {
    machine: moment(date).valueOf(),
    datetime: moment(date).format(),
    human: moment(date).format(`DD.MM.YYYY, HH:mm`),
  };
};

const getUsers = (users) => users
  .map((user, index) => {
    const [name, emailPrefix] = user.split(`, `);
    return {
      id: emailPrefix,
      name,
      email: `${emailPrefix}@gmail.com`,
      avatar: {
        regular: `avatar-${index + 1}`,
        small: `avatar-small-${index + 1}`,
      }
    };
  });

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

const getComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.COMMENT),
    text: `${shuffle(comments).slice(1, getRandomInt(Id.Phrases.MIN, Id.Phrases.MAX)).join(`. `)}.`,
    author: getUsers(users)[getRandomInt(0, users.length - 1)],
    createdDate: getDate(),
  }))
);

const getPictureFileName = (pictures) => {
  return pictures[getRandomInt(0, pictures.length - 1)];
};

const getCategories = (categories) => categories
  .map((category) => ({
    id: nanoid(Id.Length.CATEGORY),
    name: category,
  }));

const generatePosts = (count, sentences, categories, titles, comments, users, pictures) => {
  const categoriesList = getCategories(categories);

  return Array(count).fill({}).map(() => ({
    id: nanoid(Id.Length.POST),
    author: getUsers(users)[getRandomInt(0, users.length - 1)],
    picture: getPictureFileName(pictures),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    announce: `${shuffle(sentences)
      .slice(0, getRandomInt(1, 5))
      .join(`. `)}.`,
    fullText: `${shuffle(sentences)
      .slice(0, getRandomInt(1, sentences.length))
      .join(`. `)}.`,
    category: shuffle(categoriesList)
      .slice(0, getRandomInt(Category.Restrict.MIN, Category.Restrict.MAX)),
    comments: getComments(getRandomInt(Id.Restrict.MIN, Id.Restrict.MAX), comments, users),
  }));
};

module.exports = {
  getRandomInt,
  shuffle,
  generatePosts,
  getFileData,
  writePosts,
};
