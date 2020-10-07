'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getCategory = async (categoryId) => {
  return await db.Category.findByPk(categoryId, {
    include: {
      model: db.Article,
      as: `articles`,
      through: {attributes: []},

      include: [{
        model: db.Category,
        as: `categories`,
        through: {attributes: []},
      }, {
        model: db.Comment,
        as: `comments`,
        attributes: [`id`],
      }]
    }
  });
};

module.exports = getCategory;
