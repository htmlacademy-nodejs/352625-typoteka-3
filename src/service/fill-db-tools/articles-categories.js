'use strict';

const {Categories} = require(`./constants.js`);

const {getUniqueItem} = require(`./utils.js`);

const {getRandomInt} = require(`./../utils.js`);


const getArticlesCategories = (articles, categories) => {
  const articlesCategories = [];

  for (const article of articles) {
    const categoriesIds = categories.map((item) => item[0]);
    const categoriesQuantity = getRandomInt(Categories.MIN, Categories.MAX);

    let i = 1;
    do {
      const articleId = article[0];
      const categoryId = getUniqueItem(categoriesIds);

      articlesCategories.push([articleId, categoryId]);

      i++;
    } while (i <= categoriesQuantity);
  }

  return articlesCategories;
};

module.exports = getArticlesCategories;
