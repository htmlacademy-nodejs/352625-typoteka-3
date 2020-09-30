'use strict';

const getAuths = (users) => {
  return users
    .map((user, index) => {
      const id = index + 1;
      const isAuth = false;

      return [
        id,
        ` '${isAuth}'`,
      ];
    });
};

module.exports = getAuths;
