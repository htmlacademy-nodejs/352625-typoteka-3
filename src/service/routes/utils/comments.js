'use strict';

const {db} = require(`./../../../../db/db.js`);

const {Comments} = require(`./../constants.js`);

const getComments = async (count = Comments.FRESH) => {
  return await db.Comment.findAll({
    attributes: [`id`, `text`, `created_date`],
    order: [
      [`created_date`, `desc`]
    ],

    include: {
      model: db.Author,
      as: `author`,
      attributes: [`id`, `firstname`, `lastname`],

      include: {
        model: db.Avatar,
        as: `avatar`,
        attributes: [`small`]
      }
    },
    limit: count,
  });
};

module.exports = getComments;

