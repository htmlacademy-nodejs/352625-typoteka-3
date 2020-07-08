'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getArticles = async () => (await axios.get(UriApi.ARTICLES)).data;

const getArticle = async (url) => (await axios.get(encodeURI(`${UriApi.ARTICLES}/${url}`))).data;

const postArticle = (data) => axios.post(UriApi.ARTICLES, {json: data});

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

const getAuth = async () => (await axios.get(UriApi.AUTH)).data;

module.exports = {
  getArticles,
  getArticle,
  postArticle,
  getCategories,
  getAuth,
};
