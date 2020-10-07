'use strict';

const moment = require(`moment`);
const {db} = require(`./../../../../db/db.js`);

const addComment = async (data, articleId, authorId) => {
  const result = data.json;

  return await db.Comment.create({
    [`text`]: result[`text`],
    [`created_date`]: moment().toISOString(),
    [`author_id`]: authorId,
    [`article_id`]: articleId,
  });
};

const getComment = async (commentId) => {
  return await db.Comment.findByPk(commentId);
};

const deleteComment = async (commentId) => {
  return await db.Comment.destroy({
    where: {
      id: commentId
    }
  });
};

module.exports = {addComment, getComment, deleteComment};
