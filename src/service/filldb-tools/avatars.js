'use strict';

const getAvatars = (users) => users
  .map((user, index) => ({
    regular: `avatar-${index + 1}`,
    small: `avatar-small-${index + 1}`,
  }));


module.exports = getAvatars;
