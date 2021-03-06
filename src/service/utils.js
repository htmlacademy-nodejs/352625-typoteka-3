'use strict';

const moment = require(`moment`);
const fs = require(`fs`);
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
  .split(`; `)
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

const getRandomItem = (items) => items[getRandomInt(0, items.length - 1)];

const getUniqueItem = (items) => {
  const item = getRandomItem(items);
  items.splice(items.indexOf(item), 1);
  return item;
};

const getSomeSentences = (sentences, min, max) =>
  `${shuffle(sentences)
    .slice(0, getRandomInt(min, max))
    .join(`. `)}.`;

const getDate = () => {
  const date = Date.now() + getRandomInt(Time.MIN, Time.MAX);
  return moment(date).toISOString();
};


module.exports = {
  getRandomInt,
  shuffle,
  getFileData,
  getRandomItem,
  getUniqueItem,
  getSomeSentences,
  getDate,
};
