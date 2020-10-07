'use strict';

const {db} = require(`./../../../data/db/db.js`);

const {Items} = require(`./../constants.js`);

const getFreshItems = async (count = Items.FRESH) => {
  return await db.Article.findAll({
    attributes: [`id`, `picture`, `title`, `created_date`],
    order: [
      [`created_date`, `desc`]
    ],

    include: [{
      model: db.Category,
      as: `categories`,
      attributes: [`id`, `name`],
      through: {attributes: []},
    }, {
      model: db.Comment,
      as: `comments`,
      attributes: [`id`],
    }],


    limit: count,
  });
};

module.exports = getFreshItems;

