'use strict';

const getMock = require(`./../mocks-data.js`);

const getAuth = async (authStatus) => {
  let user = {};
  let userArticles = [];

  if (authStatus) {
    const articles = await getMock();

    user = articles[0].author;
    userArticles = articles.filter((item) => item.author.id === user.id);
  }

  return {status: authStatus, user, userArticles};
};

module.exports = getAuth;
