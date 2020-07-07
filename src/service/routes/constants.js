'use strict';

const PathName = {
  ARTICLES: `api/articles`,
  CATEGORIES: `api/categories`,
  SEARCH: `api/search`,
  AUTH: `api/auth`,
};

const Empty = {
  ARTICLES: [],
  ARTICLE: {},
  COMMENTS: [],
  COMMENT: {},
  CATEGORIES: [],
  DATA: ``,
  SEARCH: `No search results`,
};

const SEARCH_PARAM = `?query=`;

const AUTH_STATUS = true;

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
  AUTH_STATUS,
};
