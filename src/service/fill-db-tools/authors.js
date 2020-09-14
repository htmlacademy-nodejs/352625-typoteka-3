'use strict';

const nanoid = require(`nanoid`);

const {PASSWORD_LENGTH} = require(`./constants.js`);

const {getUniqueItem} = require(`./utils.js`);

const getAuthors = (users, avatars) => {
  const avatarIds = avatars.map((item) => item[0]);

  return users
    .map((user, index) => {
      const id = index + 1;
      const [name, emailPrefix] = user.split(`, `);
      const [firstName, lastName] = name.split(` `);

      const email = `${emailPrefix}@gmail.com`;
      const password = nanoid(PASSWORD_LENGTH);
      const avatarId = getUniqueItem(avatarIds);

      return [
        id,
        ` '${firstName}'`,
        ` '${lastName}'`,
        ` '${email}'`,
        ` '${password}'`,
        ` ${avatarId}`,
      ];
    });
};

module.exports = getAuthors;
