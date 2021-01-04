'use strict';

const axios = require(`axios`);

const {URL_API} = require(`../service/cli/constants.js`);
const {PathName} = require(`../service/api/constants.js`);

const TIMEOUT = 1000;
const defaultURL = `${URL_API}`;

class Api {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles() {
    return this._load(`/${PathName.ARTICLES}`);
  }

  getCategories() {
    return this._load(`${PathName.CATEGORIES}`);
  }

  getCategory(categoryId, pageNumber) {
    return this._load(`${PathName.CATEGORIES}/id=${categoryId}&page=${pageNumber}`);
  }

  getArticle(articleId) {
    return this._load(`/${PathName.ARTICLES}/${articleId}`);
  }

  postArticle(data) {
    return this._load(`/${PathName.ARTICLES}`, {
      method: `POST`,
      data
    });
  }

  editArticle(data) {
    return this._load(`/${PathName.ARTICLES}`, {
      method: `PUT`,
      data
    });
  }

  deleteArticle(articleId, userId) {
    const data = {articleId, userId};
    return this._load(`/${PathName.ARTICLES}`, {
      method: `DELETE`,
      data,
    });
  }

  getMyArticles(authorId) {
    return this._load(`/${PathName.ARTICLES}/byAuthor/${authorId}`);
  }

  getMostDiscussed() {
    return this._load(`${PathName.ARTICLES}/mostDiscussed`);
  }

  getFreshItems(pageNumber) {
    return this._load(`${PathName.ARTICLES}/fresh/page=${pageNumber}`);
  }

  getFreshComments() {
    return this._load(`${PathName.COMMENTS}/fresh`);
  }

  getMyComments(authorId) {
    return this._load(`${PathName.COMMENTS}/byAuthor/${authorId}`);
  }

  postComment(data) {
    return this._load(`/${PathName.ARTICLES}/comments`, {
      method: `POST`,
      data
    });
  }

  deleteComment(commentId, userId) {
    const data = {commentId, userId};
    return this._load(`/${PathName.COMMENTS}`, {
      method: `DELETE`,
      data,
    });
  }

  search(query) {
    return this._load(`/${PathName.SEARCH}`, {params: {query}});
  }

  postCategory(data) {
    return this._load(`/${PathName.CATEGORIES}`, {
      method: `POST`,
      data
    });
  }

  updateCategory(data) {
    return this._load(`/${PathName.CATEGORIES}`, {
      method: `PUT`,
      data
    });
  }

  deleteCategory(data) {
    return this._load(`/${PathName.CATEGORIES}`, {
      method: `DELETE`,
      data,
    });
  }

  register(data) {
    return this._load(`/${PathName.USER}`, {
      method: `POST`,
      data
    });
  }

  login(data) {
    return this._load(`/${PathName.USER}/login`, {
      method: `POST`,
      data
    });
  }

  logout() {
    return this._load(`/${PathName.USER}/logout`, {
      method: `POST`,
    });
  }
}

const defaultApi = new Api(defaultURL, TIMEOUT);

module.exports = {
  Api,
  getApi: () => defaultApi
};
