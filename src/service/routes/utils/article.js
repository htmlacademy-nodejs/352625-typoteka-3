'use strict';

const moment = require(`moment`);
const {db} = require(`./../../../../db/db.js`);

const getCategoriesFromServerAnswer = (data) => {
  let categories = [];

  for (const prop in data) {
    if (data.hasOwnProperty(prop) && prop.includes(`category`)) {
      categories.push(data[prop]);
    }
  }
  return categories;
};

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

const addArticle = async (data, authorId) => {
  const result = data.json;

  const article = await db.Article.create({
    [`title`]: result[`title`],
    [`announce`]: result[`announce`],
    [`full_text`]: result[`full_text`],
    [`picture`]: result[`picture`],
    [`created_date`]: result[`created_date`],
    [`author_id`]: authorId,
  });

  article.setCategories(getCategoriesFromServerAnswer(result));

  return article;
};

const updateArticle = async (data, articleId) => {
  const result = data.json;

  const article = await db.Article.update({
    [`title`]: result[`title`],
    [`announce`]: result[`announce`],
    [`full_text`]: result[`full_text`],
    [`picture`]: result[`picture`],
    [`created_date`]: moment(result[`created_date`], `DD.MM.YYYY`).toISOString(),
  }, {
    where: {id: articleId}
  });

  // TODO не разобрался как обновлять категории
  // article.setCategories(getCategoriesFromServerAnswer(result));

  return article;
};

module.exports = {getArticle, addArticle, updateArticle};
