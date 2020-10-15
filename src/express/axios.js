'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getArticles = async () => (await axios.get(UriApi.ARTICLES)).data;

const getMyArticles = async (authorId) => (await axios.get(`${UriApi.ARTICLES}/byAuthor/${authorId}`)).data;

const getArticle = async (url) => (await axios.get(encodeURI(`${UriApi.ARTICLES}/${url}`))).data;

const postArticle = (data) => axios.post(UriApi.ARTICLES, {json: data});

// TODO не получилось реализвать редактирование поста через метод PUT
const editArticle = (data, id) => axios.post(`${UriApi.ARTICLES}/${id}`, {json: data});

const getSearch = async (search) => (await axios.get(encodeURI(`${UriApi.SEARCH}${search}`))).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

const getCategory = async (id) => (await axios.get(`${UriApi.CATEGORIES}/${id}`)).data;

const getAuth = async () => (await axios.get(UriApi.AUTH)).data;

const getMostDiscussed = async () => (await axios.get(`${UriApi.ARTICLES}/mostDiscussed`)).data;

const getFreshItems = async () => (await axios.get(`${UriApi.ARTICLES}/fresh`)).data;

const getFreshComments = async () => (await axios.get(`${UriApi.COMMENTS}/fresh`)).data;

const getMyComments = async (id) => (await axios.get(`${UriApi.COMMENTS}/byAuthor/${id}`)).data;

const postComment = (data, articleId) => axios.post(`${UriApi.ARTICLES}/${articleId}/comments`, {json: data});

const deleteComment = (commentId) => axios.delete(`${UriApi.COMMENTS}/${commentId}`);

// TODO не получилось реализовать удаление поста через метод DELETE
const deleteArticle = (articleId) => axios.delete(`${UriApi.ARTICLES}/${articleId}`);

module.exports = {
  getArticles,
  getMyArticles,
  getArticle,
  postArticle,
  editArticle,
  getSearch,
  getCategories,
  getCategory,
  getAuth,
  getMostDiscussed,
  getFreshItems,
  getFreshComments,
  getMyComments,
  postComment,
  deleteComment,
  deleteArticle,
};
