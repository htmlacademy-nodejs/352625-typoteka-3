'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getArticles = async () => (await axios.get(UriApi.ARTICLES)).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

module.exports = {
  getArticles,
  getCategories,
};
