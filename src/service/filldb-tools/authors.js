'use strict';

const nanoid = require(`nanoid`);

const {PASSWORD_LENGTH} = require(`./constants.js`);

const {getUniqueItem} = require(`./../utils.js`);

const getAuthors = (users, avatars) => {
  const avatarIds = avatars.map((item, index) => index + 1);

  return users
    .map((user) => {
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = nanoid(PASSWORD_LENGTH);
      const avatarId = getUniqueItem(avatarIds);

      return {
        [`firstname`]: firstName,
        [`lastname`]: lastName,
        [`email`]: email,
        [`password`]: password,
        [`avatar_id`]: avatarId,
      };
    });
};

module.exports = getAuthors;
