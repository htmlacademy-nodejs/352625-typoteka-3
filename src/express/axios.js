'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getArticles = async () => (await axios.get(UriApi.ARTICLES)).data;

const getArticle = async (url) => (await axios.get(encodeURI(`${UriApi.ARTICLES}/${url}`))).data;

const postArticle = (data) => axios.post(UriApi.ARTICLES, {json: data});

const getSearch = async (search) => (await axios.get(encodeURI(`${UriApi.SEARCH}${search}`))).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

const getCategory = async (id) => (await axios.get(`${UriApi.CATEGORIES}/${id}`)).data;

const getAuth = async () => (await axios.get(UriApi.AUTH)).data;

const getMostDiscussed = async () => (await axios.get(`${UriApi.ARTICLES}/mostDiscussed`)).data;

const getFreshItems = async () => (await axios.get(`${UriApi.ARTICLES}/fresh`)).data;

const getComments = async () => (await axios.get(`${UriApi.COMMENTS}`)).data;

module.exports = {
  getArticles,
  getArticle,
  postArticle,
  getSearch,
  getCategories,
  getCategory,
  getAuth,
  getMostDiscussed,
  getFreshItems,
  getComments,
};
