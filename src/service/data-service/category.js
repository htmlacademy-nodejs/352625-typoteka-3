'use strict';

const {db} = require(`./../../data/db/db.js`);

class CategoryService {
  constructor(database = db) {
    this._database = database;
  }

  async findAll() {
    return await this._database.Category.findAll({
      attributes: [
        `id`,
        `name`,
      ],
      include: [{
        model: this._database.Article,
        as: `articles`,
        attributes: [`id`],
        through: {attributes: []},
      }],
    });
  }

  async findOne(categoryId) {
    return await this._database.Category.findByPk(categoryId, {
      include: {
        model: this._database.Article,
        as: `articles`,
        through: {attributes: []},

        include: [{
          model: this._database.Category,
          as: `categories`,
          through: {attributes: []},
        }, {
          model: this._database.Comment,
          as: `comments`,
          attributes: [`id`],
        }]
      }
    });
  }
}

module.exports = CategoryService;
