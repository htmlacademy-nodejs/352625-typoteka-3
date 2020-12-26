'use strict';

const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const {DEFAULT_MOCK_PASSWORD, ADMIN_USER_ID} = require(`./constants.js`);

const getAuthors = async (users) => {
  return await Promise.all(users
    .map(async (user, index) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = await bcrypt.hash(DEFAULT_MOCK_PASSWORD, saltRounds);

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
