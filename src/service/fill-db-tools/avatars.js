'use strict';

const getAvatars = (users) => users
    .map((user, index) => {
      const id = index + 1;
      const regular = `avatar-${id}`;
      const small = `avatar-small-${id}`;

      return [id, ` '${regular}'`, ` '${small}'`];
    });


module.exports = getAvatars;
