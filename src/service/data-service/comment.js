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

  async findAll() {
    return await this._database.Comment.findAll({
      attributes: [`id`, `created_date`, `text`],
      include: [{
        model: this._database.Author,
        as: `author`,
        attributes: [`firstname`, `lastname`],

        include: {
          model: this._database.Avatar,
          as: `avatar`,
          attributes: [`small`]
        }
      }, {
        model: this._database.Article,
        as: `article`,
        attributes: [`id`, `title`]
      }],
      order: [
        [`created_date`, `desc`]
      ],
    });
  }

  async findOne(commentId) {
    return await this._database.Comment.findByPk(commentId);
  }

  async checkAuthorship(commentId, userId) {
    return await this._database.Comment.findOne({
      where: {
        [`author_id`]: userId,
        id: commentId,
      },
      attributes: [`id`],
    });
  }

  async add({userId, articleId, text}) {
    return await this._database.Comment.create({
      text,
      [`created_date`]: moment().toISOString(),
      [`author_id`]: userId,
      [`article_id`]: articleId,
    });
  }

  async delete(commentId, userId) {
    await this._database.Comment.destroy({
      where: {
        [`author_id`]: userId,
        id: commentId,
      }
    });
  }
}

module.exports = CommentService;
