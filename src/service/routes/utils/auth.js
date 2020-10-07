'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getAuth = async () => {
  const authData = await db.Auth.findOne({
    where: {
      [`is_auth`]: true
    },
    include: [`user`],
  });

  let result;

  if (!authData) {

    result = {
      status: false,
      user: null,
      avatar: null,
    };

  } else {
    const userAvatar = await db.Avatar.findOne({
      where: {
        [`id`]: authData.user[`avatar_id`]
      }
    });

    result = {
      status: authData[`is_auth`],
      user: authData[`user`],
      avatar: userAvatar,
    };
  }

  return result;
};

module.exports = getAuth;
