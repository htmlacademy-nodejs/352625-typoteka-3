'use strict';

const checkCategoryId = require(`../middlewares/check-category-id.js`);
const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);
const isAuth = require(`../middlewares/is-auth.js`);
const isAdmin = require(`../middlewares/is-admin.js`);

module.exports = {
  checkCategoryId,
  uploadFile,
  saveFileNameToBody,
  isAuth,
  isAdmin,
};
