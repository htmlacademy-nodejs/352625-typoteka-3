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

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
  Items,
  Comments,
};
