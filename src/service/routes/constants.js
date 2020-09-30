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
  SEARCH: [],
};

const SEARCH_PARAM = `?query=`;

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
};
