'use strict';

const {db} = require(`./../../../../db/db.js`);

const getArticles = async () => {
  return await db.Article.findAll();
};

module.exports = getArticles;

