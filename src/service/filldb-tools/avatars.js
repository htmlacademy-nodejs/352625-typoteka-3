'use strict';

const {getUniqueItem} = require(`./../utils.js`);

const getAvatars = (users) => {
  const usersIds = users.map((item, index) => index + 1);

  return users
    .map((user, index) => ({
      [`author_id`]: getUniqueItem(usersIds),
      regular: `avatar-${index + 1}.png`,
      small: `avatar-small-${index + 1}.png`,
    }));
};

module.exports = getAvatars;
