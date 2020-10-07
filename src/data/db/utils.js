'use strict';

const getArticlesIds = (list) => [...(new Set(list.map((item) => item.article_id)))];

const getCategories = (list, articleId) => list
    .filter((item) => item.article_id === articleId)
    .map((item) => item.category_id);

module.exports = {
  getArticlesIds,
  getCategories,
};
