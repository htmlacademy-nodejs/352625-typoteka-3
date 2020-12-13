'use strict';

const nanoid = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const {PASSWORD_LENGTH, ADMIN_USER_ID} = require(`./constants.js`);

const getAuthors = async (users) => {
  return await Promise.all(users
    .map(async (user, index) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = await bcrypt.hash(nanoid(PASSWORD_LENGTH), saltRounds);

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
