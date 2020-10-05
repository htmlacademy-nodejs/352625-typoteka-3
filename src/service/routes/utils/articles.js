'use strict';

const {db} = require(`./../../../../db/db.js`);

const getArticles = async () => {
  return await db.Article.findAll();
};

const getArticlesByUserId = async (userId) => {
  return await db.Article.findAll({
    attributes: [`id`, `title`, `created_date`],
    include: {
      model: db.Author,
      as: `author`,
      where: {
        id: userId
      },
      attributes: [`firstname`, `lastname`],
    }
  });
};

module.exports = {getArticles, getArticlesByUserId};
