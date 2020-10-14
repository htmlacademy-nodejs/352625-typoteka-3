'use strict';

const {db} = require(`./../../data/db/db.js`);
const moment = require(`moment`);

const {Comments} = require(`../api/constants.js`);

class CommentService {
  constructor(database = db) {
    this._database = database;
  }

  async findFresh(count = Comments.FRESH) {
    return await this._database.Comment.findAll({
      attributes: [`id`, `text`, `created_date`],
      order: [
        [`created_date`, `desc`]
      ],

      include: {
        model: this._database.Author,
        as: `author`,
        attributes: [`id`, `firstname`, `lastname`],

        include: {
          model: this._database.Avatar,
          as: `avatar`,
          attributes: [`small`]
        }
      },
      limit: count,
    });
  }

  async findAllByUserId(userId) {
    return await this._database.Comment.findAll({
      attributes: [`id`, `created_date`],
      include: [{
        model: this._database.Author,
        as: `author`,
        where: {
          id: userId
        },
        attributes: [`firstname`, `lastname`],

        include: {
          model: this._database.Avatar,
          as: `avatar`,
          attributes: [`small`]
        }
      }, {
        model: this._database.Article,
        as: `article`,
        attributes: [`id`, `title`, `announce`]
      }]
    });
  }

  async findOne(commentId) {
    return await this._database.Comment.findByPk(commentId);
  }

  async add(formData, articleId, authorId) {
    const result = formData.json;

    return await this._database.Comment.create({
      [`text`]: result[`text`],
      [`created_date`]: moment().toISOString(),
      [`author_id`]: authorId,
      [`article_id`]: articleId,
    });
  }

  async delete(commentId) {
    await this._database.Comment.destroy({
      where: {
        id: commentId
      }
    });
  }
}

module.exports = CommentService;
