'use strict';

const {db} = require(`./../../../data/db/db.js`);

const {Comments} = require(`./../constants.js`);

const getFreshComments = async (count = Comments.FRESH) => {
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

const getCommentsByUserId = async (userId) => {
  return await db.Comment.findAll({
    attributes: [`id`, `created_date`],
    include: [{
      model: db.Author,
      as: `author`,
      where: {
        id: userId
      },
      attributes: [`firstname`, `lastname`],

      include: {
        model: db.Avatar,
        as: `avatar`,
        attributes: [`small`]
      }
    }, {
      model: db.Article,
      as: `article`,
      attributes: [`id`, `title`, `announce`]
    }]
  });
};

module.exports = {getFreshComments, getCommentsByUserId};

