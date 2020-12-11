'use strict';

const checkApiReply = require(`../middlewares/check-api-reply.js`);
const checkCategoryId = require(`../middlewares/check-category-id.js`);
const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);
const isAuth = require(`../middlewares/is-auth.js`);
const isAdmin = require(`../middlewares/is-admin.js`);

module.exports = {
  checkApiReply,
  checkCategoryId,
  uploadFile,
  saveFileNameToBody,
  isAuth,
  isAdmin,
};
