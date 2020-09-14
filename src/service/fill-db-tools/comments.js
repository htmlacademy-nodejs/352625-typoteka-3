'use strict';

const {Comments} = require(`./constants.js`);

const {getRandomItem, getDate} = require(`./utils.js`);

const {getRandomInt} = require(`./../utils.js`);

const getComments = (articles, authors, commentsSentences) => {
  const comments = [];
  let commentCount = 1;

  for (const article of articles) {
    const commentsQuantity = getRandomInt(Comments.MIN, Comments.MAX);
    let i = 1;

    do {
      const id = commentCount;
      const comment = getRandomItem(commentsSentences);
      const createdDate = getDate();
      const authorId = getRandomItem(authors)[0];
      const articleId = article[0];

      comments.push([id, ` '${comment}'`, ` '${createdDate}'`, ` ${authorId}`, ` ${articleId}`]);
      i++;
      commentCount++;

    } while (i <= commentsQuantity);
  }
  return comments;
};

module.exports = getComments;
