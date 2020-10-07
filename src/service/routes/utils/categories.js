'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getCategories = async () => {
  return await db.Category.findAll({
    attributes: [
      `id`,
      `name`,
    ],
    include: [{
      model: db.Article,
      as: `articles`,
      attributes: [`id`],
      through: {attributes: []},
    }],
  });
};

module.exports = getCategories;
