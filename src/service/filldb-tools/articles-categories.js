'use strict';

const {Categories} = require(`./constants.js`);

const {getUniqueItem, getRandomInt} = require(`./../utils.js`);

const getArticlesCategories = (articles, categories) => {

  const articlesCategories = [];

  for (const article of articles) {
    const categoriesIds = categories.map((item, index) => index + 1);
    const categoriesQuantity = getRandomInt(Categories.MIN, Categories.MAX);

    let i = 1;
    do {
      const articleId = articles.indexOf(article) + 1;
      const categoryId = getUniqueItem(categoriesIds);

      articlesCategories.push({
        [`article_id`]: articleId,
        [`category_id`]: categoryId,
      });

      i++;
    } while (i <= categoriesQuantity);
  }

  return articlesCategories;
};

module.exports = getArticlesCategories;
