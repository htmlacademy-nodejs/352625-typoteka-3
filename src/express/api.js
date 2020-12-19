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

  getAuth() {
    return this._load(`${PathName.AUTH}`);
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

  editArticle(data, articleId) {
    return this._load(`/${PathName.ARTICLES}/${articleId}`, {
      method: `PUT`,
      data
    });
  }

  deleteArticle(articleId) {
    return this._load(`/${PathName.ARTICLES}/${articleId}`, {
      method: `DELETE`
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

  postComment(data, articleId) {
    return this._load(`/${PathName.ARTICLES}/${articleId}/comments`, {
      method: `POST`,
      data
    });
  }

  deleteComment(commentId) {
    return this._load(`/${PathName.COMMENTS}/${commentId}`, {
      method: `DELETE`
    });
  }

  search(query) {
    return this._load(`/${PathName.SEARCH}`, {params: {query}});
  }

  postCategory(data) {
    return this._load(`/${PathName.CATEGORIES}/add`, {
      method: `POST`,
      data
    });
  }

  updateCategory(data, categoryId) {
    return this._load(`/${PathName.CATEGORIES}/${categoryId}`, {
      method: `PUT`,
      data
    });
  }

  deleteCategory(categoryId) {
    return this._load(`/${PathName.CATEGORIES}/${categoryId}`, {
      method: `DELETE`
    });
  }

  register(data) {
    return this._load(`/${PathName.USER}`, {
      method: `POST`,
      data
    });
  }

  login() {}

  logout() {}
}

const defaultApi = new Api(defaultURL, TIMEOUT);

module.exports = {
  Api,
  getApi: () => defaultApi
};
