'use strict';

const PathName = {
  ARTICLES: `api/articles`,
  CATEGORIES: `api/categories`,
  SEARCH: `api/search`,
  AUTH: `api/auth`,
  COMMENTS: `api/comments`,
};

const Empty = {
  ARTICLES: [],
  ARTICLE: {},
  COMMENTS: [],
  COMMENT: {},
  CATEGORIES: [],
  CATEGORY: {},
  DATA: ``,
  SEARCH: [],
};

const Items = {
  FRESH: 2,
  MOST_DISCUSSED: 2,
};

const Comments = {
  FRESH: 4,
};

const SEARCH_PARAM = `?query=`;

const SEARCH_LIMIT = 4;

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
  SEARCH_LIMIT,
  Items,
  Comments,
};
