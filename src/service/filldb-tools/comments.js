'use strict';

const {Comments} = require(`./constants.js`);

const {getRandomInt, getRandomItem, getDate} = require(`./../utils.js`);

const getComments = (articles, authors, commentsSentences) => {
  const authorsIds = authors.map((author, index) => index + 1);

  const comments = [];

  for (const article of articles) {
    const commentsQuantity = getRandomInt(Comments.MIN, Comments.MAX);
    let i = 1;

    do {
      const text = getRandomItem(commentsSentences);
      const createdDate = getDate();
      const authorId = getRandomItem(authorsIds);
      const articleId = articles.indexOf(article) + 1;

      comments.push({
        [`text`]: text,
        [`created_date`]: createdDate,
        [`author_id`]: authorId,
        [`article_id`]: articleId,
      });

      i++;

    } while (i <= commentsQuantity);
  }
  return comments;
};

module.exports = getComments;
