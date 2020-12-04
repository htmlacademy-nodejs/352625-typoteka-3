'use strict';

const nanoid = require(`nanoid`);

const {PASSWORD_LENGTH, ADMIN_USER_ID} = require(`./constants.js`);

const getAuthors = (users) => {
  return users
    .map((user, index) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = nanoid(PASSWORD_LENGTH);

      return {
        [`firstname`]: firstName,
        [`lastname`]: lastName,
        [`email`]: email,
        [`password`]: password,
        [`is_admin`]: index + 1 === ADMIN_USER_ID,
      };
    });
};

module.exports = getAuthors;
