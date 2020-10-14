'use strict';

const initModels = (orm) => {
  const Avatar = require(`./avatar.js`)(orm);
  const Author = require(`./author.js`)(orm);
  const Auth = require(`./auth.js`)(orm);
  const Article = require(`./article.js`)(orm);
  const Comment = require(`./comment.js`)(orm);
  const Category = require(`./category.js`)(orm);
  const ArticleCategory = require(`./article-category.js`)(orm);

  Author.hasOne(Avatar, {
    foreignKey: `author_id`,
    as: `avatar`,
  });

  Author.hasMany(Article, {
    foreignKey: `author_id`,
  });

  Author.hasMany(Comment, {
    foreignKey: `author_id`,
  });

  Auth.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `user`,
  });

  Article.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `author`,
  });

  Article.hasMany(Comment, {
    foreignKey: `article_id`,
    as: `comments`,
  });

  Article.belongsToMany(Category, {
    as: `categories`,
    foreignKey: `article_id`,
    through: `ArticleCategory`,
    timestamps: false,
  });

  Comment.belongsTo(Author, {
    foreignKey: `author_id`,
    as: `author`,
  });

  Comment.belongsTo(Article, {
    foreignKey: `article_id`,
    as: `article`,
  });

  Category.belongsToMany(Article, {
    as: `articles`,
    foreignKey: `category_id`,
    through: `ArticleCategory`,
    timestamps: false,
  });

  return {
    Avatar,
    Author,
    Auth,
    Article,
    Comment,
    Category,
    ArticleCategory,
  };
};

module.exports = initModels;
