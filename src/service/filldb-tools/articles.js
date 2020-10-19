'use strict';

const {getRandomItem, getSomeSentences, getDate} = require(`./../utils.js`);

const getArticles = (count, sentences, titles, pictures, authors) => {
  const articles = [];
  const authorsIds = authors.map((item, index) => index + 1);

  let i = 1;
  do {
    const title = getRandomItem(titles);
    const announce = getSomeSentences(sentences, 1, 3);
    const fullText = getSomeSentences(sentences, 1, sentences.length);
    const picture = `${getRandomItem(pictures)}@1x.jpg`;
    const createdDate = getDate();
    const authorId = getRandomItem(authorsIds);

    articles.push({
      [`title`]: title,
      [`announce`]: announce,
      [`full_text`]: fullText,
      [`picture`]: picture,
      [`created_date`]: createdDate,
      [`author_id`]: authorId,
    });

    i++;

  } while (i <= count);

  return articles;
};

module.exports = getArticles;
