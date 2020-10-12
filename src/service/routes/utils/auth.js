'use strict';

const {db} = require(`./../../../data/db/db.js`);

const getAuth = async () => {
  const authData = await db.Auth.findOne({
    where: {
      [`is_auth`]: true
    },
    include: {
      model: db.Author,
      as: `user`,
      attributes: [`id`, `firstname`, `lastname`],

      include: {
        model: db.Avatar,
        as: `avatar`,
        attributes: [`regular`, `small`],
      }
    }
  });

  let result = {
    status: false,
    user: null,
  };

  if (authData) {
    result = {
      status: authData[`is_auth`],
      user: authData[`user`],
    };
  }

  return result;
};

module.exports = getAuth;
