'use strict';

const {db} = require(`./../../../../db/db.js`);

const getArticle = async (articleId) => {

  return await db.Article.findByPk(articleId, {
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
      model: db.Category,
      as: `categories`,
      attributes: [
        `id`,
        `name`,
      ],
      through: {attributes: []},

      include: [{
        model: db.Article,
        as: `articles`,
        attributes: [`id`],
        through: {attributes: []},
      }],

    }, {

      model: db.Comment,
      as: `comments`,
      attributes: [
        `id`,
        `text`,
        `created_date`,
      ],

      include: [{
        model: db.Author,
        attributes: [`id`, `firstname`, `lastname`],
        as: `author`,

        include: [{
          model: db.Avatar,
          attributes: [`regular`, `small`],
          as: `avatar`
        }]
      }]
    }],
  });

};

module.exports = getArticle;
