'use strict';

const makeCategoriesValid = (article) => {
  if (!article.categories) {
    article.categories = [];
  }
  if (article.categories && article.categories.length === 1) {
    article.categories = [parseInt(article.categories, 10)];
  }
  if (article.categories && article.categories.length > 1) {
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
