'use strict';

const {db, sequelize} = require(`./../../data/db/db.js`);
const moment = require(`moment`);

const {Items, Pagination, Empty} = require(`../api/constants.js`);

class ArticleService {
  constructor(database = db, orm = sequelize) {
    this._database = database;
    this._orm = orm;
    this._mostDiscussedCount = Items.MOST_DISCUSSED;
  }

  async findAll() {
    return await this._database.Article.findAll();
  }

  async findFresh(currentPage = Pagination.DEFAULT_PAGE) {
    const freshItems = await this._database.Article.findAndCountAll({
      attributes: [`id`, `picture`, `title`, `created_date`],
      distinct: true,
      offset: Pagination.SIZE * (currentPage - 1),
      limit: Pagination.SIZE,
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
    });

    return {
      totalItems: freshItems.count,
      totalPages: Math.ceil(freshItems.count / Pagination.SIZE),
      currentPage: parseInt(currentPage, 10),
      items: freshItems.rows,
    };
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
    const article = await this._database.Article.create({
      [`title`]: formData[`title`],
      [`announce`]: formData[`announce`],
      [`full_text`]: formData[`full_text`],
      [`picture`]: formData[`picture`],
      [`created_date`]: moment(formData[`created_date`], `DD.MM.YYYY, HH:mm`).toISOString(),
      [`author_id`]: authorId,
    });

    if (formData[`categories`]) {
      article.setCategories(formData[`categories`]);
    }

    return article;
  }

  async update(formData, articleId) {
    const article = await this._database.Article.findByPk(articleId);

    article[`title`] = formData[`title`];
    article[`announce`] = formData[`announce`];
    article[`full_text`] = formData[`full_text`];
    article[`picture`] = formData[`picture`] || formData[`picture_filename`];
    article[`created_date`] = moment(formData[`created_date`], `DD.MM.YYYY, HH:mm`).toISOString();

    if (formData[`categories`]) {
      article.setCategories(formData[`categories`]);
    } else {
      article.setCategories(Empty.CATEGORIES);
    }

    await article.save();
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
