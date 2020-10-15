'use strict';

const {db, sequelize} = require(`./../../data/db/db.js`);
const moment = require(`moment`);

const {Items} = require(`../api/constants.js`);

const getCategoriesFromServerAnswer = (data) => {
  const categories = [];

  for (const prop in data) {
    if (data.hasOwnProperty(prop) && prop.includes(`category`)) {
      categories.push(data[prop]);
    }
  }
  return categories;
};

class ArticleService {
  constructor(database = db, orm = sequelize) {
    this._database = database;
    this._orm = orm;
    this._mostDiscussedCount = Items.MOST_DISCUSSED;
    this._freshItemsCount = Items.FRESH;
  }

  async findAll() {
    return await this._database.Article.findAll();
  }

  async findFresh() {
    return await this._database.Article.findAll({
      attributes: [`id`, `picture`, `title`, `created_date`],
      order: [
        [`created_date`, `desc`]
      ],

      include: [{
        model: this._database.Category,
        as: `categories`,
        attributes: [`id`, `name`],
        through: {attributes: []},
      }, {
        model: this._database.Comment,
        as: `comments`,
        attributes: [`id`],
      }],

      limit: this._freshItemsCount,
    });
  }

  async findMostDiscussed() {
    return await this._database.Article.findAll({
      attributes: {
        include: [this._orm.fn(`count`, this._orm.col(`comments.id`)), `count`]
      },
      include: {
        model: this._database.Comment,
        as: `comments`,
        attributes: [],
        duplicating: false,
        required: false,
      },
      group: [`Article.id`],

      order: [
        [`count`, `desc`]
      ],

      limit: this._mostDiscussedCount,
    });
  }

  async findOne(articleId) {
    return await this._database.Article.findByPk(articleId, {
      attributes: [
        `id`,
        `title`,
        `announce`,
        `full_text`,
        `created_date`,
        `picture`,
      ],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->articles.id`,
        `comments.id`,
        `comments->author.id`,
        `comments->author->avatar.id`,
      ],
      order: [
        [`comments`, `created_date`, `desc`]
      ],

      include: [{
        model: this._database.Category,
        as: `categories`,
        attributes: [
          `id`,
          `name`,
        ],
        through: {attributes: []},

        include: [{
          model: this._database.Article,
          as: `articles`,
          attributes: [`id`],
          through: {attributes: []},
        }],

      }, {

        model: this._database.Comment,
        as: `comments`,
        attributes: [
          `id`,
          `text`,
          `created_date`,
        ],

        include: [{
          model: this._database.Author,
          attributes: [`id`, `firstname`, `lastname`],
          as: `author`,

          include: [{
            model: this._database.Avatar,
            attributes: [`regular`, `small`],
            as: `avatar`,
          }]
        }]
      }],
    });
  }

  async findAllByAuthor(authorId) {
    return await this._database.Article.findAll({
      attributes: [`id`, `title`, `created_date`],
      include: {
        model: this._database.Author,
        as: `author`,
        where: {
          id: authorId
        },
        attributes: [`firstname`, `lastname`],
      }
    });
  }

  async add(formData, authorId) {
    const result = formData.json;

    const article = await this._database.Article.create({
      [`title`]: result[`title`],
      [`announce`]: result[`announce`],
      [`full_text`]: result[`full_text`],
      [`picture`]: result[`picture`],
      [`created_date`]: result[`created_date`],
      [`author_id`]: authorId,
    });

    article.setCategories(getCategoriesFromServerAnswer(result));

    return article;
  }

  async update(formData, articleId) {
    const result = formData.json;

    // TODO не разобрался как обновлять категории - для Model.update метода Model.setCategories([...]) не существует;
    return await this._database.Article.update({
      [`title`]: result[`title`],
      [`announce`]: result[`announce`],
      [`full_text`]: result[`full_text`],
      [`picture`]: result[`picture`],
      [`created_date`]: moment(result[`created_date`], `DD.MM.YYYY`).toISOString(),
    }, {
      where: {id: articleId}
    });

  }

  async delete(articleId) {
    return await this._database.Article.destroy({
      where: {
        id: articleId
      }
    });
  }
}

module.exports = ArticleService;
