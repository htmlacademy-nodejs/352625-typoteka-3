'use strict';

const {db, sequelize} = require(`./../../data/db/db.js`);
const {Pagination} = require(`../api/constants.js`);

class CategoryService {
  constructor(database = db, orm = sequelize) {
    this._database = database;
    this._orm = orm;
  }

  async findAll() {
    return await this._database.Category.findAll({
      attributes: [
        `id`,
        `name`,
        [this._orm.fn(`count`, this._orm.col(`articles.id`)), `totalArticles`]
      ],
      include: [{
        model: this._database.Article,
        as: `articles`,
        attributes: [],
        through: {attributes: []},
      }],
      group: [`Category.id`],
    });
  }

  async findOne(categoryId, currentPage = Pagination.DEFAULT_PAGE) {
    const activeCategory = await this._database.Category.findByPk(categoryId, {
      attributes: [`id`],
    });

    const articlesByCategory = await this._database.Article.findAndCountAll({
      attributes: [`id`, `title`, `announce`, `created_date`, `picture`],
      distinct: true,
      offset: Pagination.SIZE * (currentPage - 1),
      limit: Pagination.SIZE,
      include: {
        model: this._database.Category,
        as: `categories`,
        attributes: [],
        through: {attributes: []},
        where: {id: activeCategory.id},
      }
    });

    const articles = [];

    for (const item of articlesByCategory.rows) {
      const article = item.dataValues;

      article.totalComments = (await this._database.Comment.findAndCountAll({
        attributes: [`id`],
        where: {
          [`article_id`]: article.id
        },
      })).count;

      article.categories = await this._database.Category.findAll({
        attributes: [`id`, `name`],
        include: {
          model: this._database.Article,
          as: `articles`,
          attributes: [],
          duplicating: false,
          where: {
            id: item.dataValues.id
          }
        }
      });

      articles.push(article);
    }

    return {
      activeCategory,
      articles: {
        totalItems: articlesByCategory.count,
        totalPages: Math.ceil(articlesByCategory.count / Pagination.SIZE),
        currentPage: parseInt(currentPage, 10),
        items: articles,
      }
    };
  }

  async getArticlesCount(categoryId) {
    return await this._database.Category.findOne({
      where: {
        id: categoryId,
      },
      attributes: [[this._orm.fn(`count`, this._orm.col(`articles.id`)), `totalArticles`]],
      include: [{
        model: this._database.Article,
        as: `articles`,
        attributes: [],
        through: {attributes: []},
      }],
      group: [`Category.id`],
    });
  }

  async checkAuthorship(categoryId, userId) {
    return await this._database.Category.findOne({
      where: {
        [`author_id`]: userId,
        id: categoryId,
      },
      attributes: [`id`],
    });
  }

  async add({userId, category}) {
    await this._database.Category.create({
      name: category,
      [`author_id`]: userId,
    });
  }

  async update({userId, categoryId, category}) {
    const item = await this._database.Category.findByPk(categoryId);
    item[`name`] = category;
    item[`author_id`] = userId;
    await item.save();
  }

  async delete({userId, categoryId}) {
    await this._database.Category.destroy({
      where: {
        [`author_id`]: userId,
        id: categoryId,
      }
    });
  }
}

module.exports = CategoryService;
