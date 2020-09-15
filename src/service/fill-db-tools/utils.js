'use strict';

const moment = require(`moment`);

const {
  Time,
} = require(`./../cli/constants.js`);

const {
  shuffle,
  getRandomInt,
} = require(`./../utils.js`);

const getSqlStatement = (tableName) => `INSERT INTO ${tableName} VALUES`;

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
  return moment(date).format(`DD-MM-YYYY`);
};

const insertSqlValues = (data, tableName) => {
  let values = getSqlStatement(tableName);

  for (const item of data) {
    const value = `\n(${item})${(data.indexOf(item) + 1) === data.length ? `;\n\n` : `,`}`;
    values += value;
  }

  return values;
};


module.exports = {
  getSqlStatement,
  getRandomItem,
  getUniqueItem,
  getSomeSentences,
  getDate,
  insertSqlValues,
};
