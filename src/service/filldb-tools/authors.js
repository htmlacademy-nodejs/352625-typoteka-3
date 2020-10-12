'use strict';

const nanoid = require(`nanoid`);

const {PASSWORD_LENGTH} = require(`./constants.js`);

const getAuthors = (users) => {
  return users
    .map((user) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = nanoid(PASSWORD_LENGTH);

      return {
        [`firstname`]: firstName,
        [`lastname`]: lastName,
        [`email`]: email,
        [`password`]: password,
      };
    });
};

module.exports = getAuthors;
