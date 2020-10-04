'use strict';

const {db, sequelize} = require(`./../../../../db/db.js`);

const {Items} = require(`./../constants.js`);

const getMostDiscussed = async (commentsCount = Items.MOST_DISCUSSED) => {
  return await db.Article.findAll({
    attributes: {
      include: [sequelize.fn(`count`, sequelize.col(`comments.id`)), `count`]
    },
    include: {
      model: db.Comment,
      as: `comments`,
      attributes: [],
      duplicating: false,
      required: false,
    },
    group: [`Article.id`],

    order: [
      [`count`, `desc`]
    ],

    limit: commentsCount,
  });
};

module.exports = getMostDiscussed;
