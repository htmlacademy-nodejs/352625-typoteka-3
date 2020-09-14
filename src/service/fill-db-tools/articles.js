'use strict';

const {getRandomItem, getSomeSentences, getDate} = require(`./utils.js`);

const getArticles = (count, sentences, titles, pictures, authors) => {
  const articles = [];

  let i = 1;
  do {
    const id = i;
    const title = getRandomItem(titles);
    const announce = getSomeSentences(sentences, 1, 5);
    const fullText = getSomeSentences(sentences, 1, sentences.length);
    const picture = getRandomItem(pictures);
    const createdDate = getDate();
    const authorId = getRandomItem(authors)[0];

    articles.push([id, ` '${title}'`, ` '${announce}'`, ` '${fullText}'`, ` '${picture}'`, ` '${createdDate}'`, ` ${authorId}`]);
    i++;

  } while (i <= count);

  return articles;
};

module.exports = getArticles;
