'use strict';

const bcrypt = require(`bcrypt`);

const {DEFAULT_MOCK_PASSWORD, ADMIN_USER_ID, SALT_ROUNDS} = require(`./constants.js`);

const getAuthors = async (users) => {
  return await Promise.all(users
    .map(async (user, index) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = await bcrypt.hash(DEFAULT_MOCK_PASSWORD, SALT_ROUNDS);

      return {
        [`firstname`]: firstName,
        [`lastname`]: lastName,
        [`email`]: email,
        [`password`]: password,
        [`is_admin`]: index + 1 === ADMIN_USER_ID,
      };
    }));
};

module.exports = getAuthors;
