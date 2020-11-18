'use strict';

const loginByAuthorId = async (AuthorId, db) => {
  const targetAuth = await db.Auth.findOne({where: {[`author_id`]: AuthorId}});
  targetAuth[`is_auth`] = true;
  await targetAuth.save();
};

const logoutByAuthorId = async (AuthorId, db) => {
  const targetAuth = await db.Auth.findOne({where: {[`author_id`]: AuthorId}});
  targetAuth[`is_auth`] = false;
  await targetAuth.save();
};


module.exports = {
  loginByAuthorId,
  logoutByAuthorId,
};
