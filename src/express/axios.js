'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getArticles = async () => (await axios.get(UriApi.ARTICLES)).data;

const getArticle = async (url) => (await axios.get(encodeURI(`${UriApi.ARTICLES}/${url}`))).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

module.exports = {
  getArticles,
  getArticle,
  getCategories,
};