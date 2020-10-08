'use strict';

const getAvatars = require(`./avatars.js`);

const getAuthors = require(`./authors.js`);

const getAuth = require(`./auths.js`);

const getArticles = require(`./articles.js`);

const getComments = require(`./comments.js`);

const getCategories = require(`./categories.js`);

const getArticlesCategories = require(`./articles-categories.js`);

const getContent = (count, users, authUserId, sentences, titles, pictures, commentsSentences, categoriesSentences) => {
  const avatars = getAvatars(users);
  const authors = getAuthors(users, avatars);
  const auths = getAuth(users, authUserId);
  const articles = getArticles(count, sentences, titles, pictures, authors);
  const comments = getComments(articles, authors, commentsSentences);
  const categories = getCategories(categoriesSentences);
  const articlesCategories = getArticlesCategories(articles, categories);

  return {
    avatars,
    authors,
    auths,
    articles,
    comments,
    categories,
    articlesCategories,
  };
};

module.exports = getContent;
