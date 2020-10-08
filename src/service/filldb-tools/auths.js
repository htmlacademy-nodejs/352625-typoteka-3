'use strict';

const getAuths = (users, authUserId) => {
  return users
    .map((user, index) => ({
      [`author_id`]: index + 1,
      [`is_auth`]: (authUserId === index + 1),
    }));
};

module.exports = getAuths;
