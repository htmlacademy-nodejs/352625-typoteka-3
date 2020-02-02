'use strict';

const moment = require(`moment`);

const {Time} = require(`./cli/constants.js`);

const {
  TITLES,
  SENTENCES,
  CATEGORIES,
} = require(`./cli/mocksData.js`);

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
  getRandomInt,
  shuffle,
  generatePosts,
};
