'use strict';

const makeCategoriesValid = (article) => {
  if (!article.categories) {
    article.categories = [];
  }
  if (!Array.isArray(article.categories)) {
    article.categories = [parseInt(article.categories, 10)];
  }
  if (Array.isArray(article.categories)) {
    article.categories = article.categories.map((item) => parseInt(item, 10));
  }
  return article;
};

module.exports = () => (
  (req, res, next) => {
    req.body = makeCategoriesValid(req.body);

    next();
  }
);
