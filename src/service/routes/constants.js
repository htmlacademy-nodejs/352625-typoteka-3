'use strict';

const PathName = {
  ARTICLES: `api/articles`,
  CATEGORIES: `api/categories`,
  SEARCH: `api/search`,
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

module.exports = {
  PathName,
  Empty,
  SEARCH_PARAM,
};
