'use strict';

const {Tables} = require(`./constants.js`);

const {insertSqlValues} = require(`./utils.js`);

const getAvatars = require(`./avatars.js`);

const getAuthors = require(`./authors.js`);

const getArticles = require(`./articles.js`);

const getComments = require(`./comments.js`);

const getCategories = require(`./categories.js`);

const getArticlesCategories = require(`./articles-categories.js`);

const getSqlContent = (count, sentences, titles, pictures, users, commentsSentences, categoriesSentences) => {
  const avatars = getAvatars(users);
  const authors = getAuthors(users, avatars);
  const articles = getArticles(count, sentences, titles, pictures, authors);

  const comments = getComments(articles, authors, commentsSentences);
  const categories = getCategories(categoriesSentences);
  const articlesCategories = getArticlesCategories(articles, categories);

  let content = insertSqlValues(avatars, Tables.AVATARS);
  content += insertSqlValues(authors, Tables.AUTHORS);
  content += insertSqlValues(articles, Tables.ARTICLES);

  content += insertSqlValues(comments, Tables.COMMENTS);
  content += insertSqlValues(categories, Tables.CATEGORIES);
  content += insertSqlValues(articlesCategories, Tables.ARTICLES_CATEGORIES);

  return content;
};

module.exports = getSqlContent;
